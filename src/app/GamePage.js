"use client";

import { useState, useEffect } from "react";
import { wordList } from "./config";
// import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import OnScreenKeyboard from "./OnScreenKeyboard";
import { endpoint } from "../utils/endpoint";
import { ConnectWallet, useUser, useAddress } from "@thirdweb-dev/react";

let correctCharArray = [];
let presentCharArray = [];
let absentCharArray = [];
async function getAllCharacters() {
  const data = await fetch(`/api/word`);

  if (!data.ok) {
    throw new Error("Failed to fetch data");
  }

  return data.json();
}
export default function GamePage() {
  const [boardData, setBoardData] = useState();
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [charArray, setCharArray] = useState([]);
  const [solution, setSolution] = useState("");
  const [hint, setHint] = useState("");
  const [score, setScore] = useState({});
  const [points, setPoints] = useState(0);
  const address = useAddress();

  useEffect(() => {
    console.log(address);

    if (address) {
      authenticateWithWeb3(address);
    }
  }, [address]);

  const authenticateWithWeb3 = async (web3Address) => {
    const response = await fetch(`/api/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ web3Address }),
    });

    if (response.ok) {
      const { jwtToken, userId, points } = await response.json();
      console.log(jwtToken);
      localStorage.setItem("jwtToken", jwtToken);
      localStorage.setItem("userId", userId);
      setPoints(points);
    }
  };
  const submitUserWord = async () => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(`/api/userword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const { points } = await response.json();
      setPoints(points);
    }
  };
  const resetBoard = () => {
    var alphabetIndex = Math.floor(Math.random() * 26);
    var wordIndex = Math.floor(
      Math.random() * wordList[String.fromCharCode(97 + alphabetIndex)].length
    );
    let newBoardData = {
      ...boardData,
      solution: wordList[String.fromCharCode(97 + alphabetIndex)][wordIndex],
      rowIndex: 0,
      boardWords: [],
      boardRowStatus: [],
      presentCharArray: [],
      absentCharArray: [],
      correctCharArray: [],
      status: "IN_PROGRESS",
    };
    setBoardData(newBoardData);
    localStorage.setItem("board-data", JSON.stringify(newBoardData));
  };

  useEffect(() => {
    console.log("scoreChanged", score);
    if (!score.word) return;
    let rowIndex = boardData.rowIndex;
    let boardRowStatus = boardData.boardRowStatus;
    let boardWords = boardData.boardWords;
    boardRowStatus.push(score.score);
    boardWords[rowIndex] = `${score.word}`;
    rowIndex++;
    const allCorrect = score.score.every((element) => element === "correct");

    setBoardData({
      ...boardData,
      rowIndex,
      boardRowStatus,
      boardWords,
      presentCharArray: [
        ...boardData.presentCharArray,
        ...score.presentCharArray,
      ],
      correctCharArray: [
        ...boardData.correctCharArray,
        ...score.correctCharArray,
      ],
      absentCharArray: [...boardData.absentCharArray, ...score.absentCharArray],
      status: allCorrect ? "WIN" : boardData.status,
    });
    if (allCorrect) {
      submitUserWord();
    }
  }, [score]);

  useEffect(() => {
    const getData = async () => {
      const randomCryptoWord = await getAllCharacters();
      setSolution(randomCryptoWord?.word);
      setHint(randomCryptoWord.hint);
      if (!boardData || !boardData.solution) {
        let newBoardData = {
          ...boardData,
          solution: randomCryptoWord?.word,
          rowIndex: 0,
          boardWords: [],
          boardRowStatus: [],
          presentCharArray: [],
          absentCharArray: [],
          correctCharArray: [],
          status: "IN_PROGRESS",
        };
        setBoardData(newBoardData);
        localStorage.setItem("board-data", JSON.stringify(newBoardData));
      }
    };
    getData();
  }, []);

  const handleMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 2000);
  };

  const enterBoardWord = async (word) => {
    let score = [];
    for (var index = 0; index < word.length; index++) {
      const char = word.charAt(index);
      if (solution.charAt(index) === char) {
        score.push("correct");
        if (!correctCharArray.includes(char)) correctCharArray.push(char);
        if (presentCharArray.indexOf(char) !== -1)
          presentCharArray.splice(presentCharArray.indexOf(char), 1);
      } else if (solution.includes(char)) {
        score.push("present");
        if (
          !correctCharArray.includes(char) &&
          !presentCharArray.includes(char)
        )
          presentCharArray.push(char);
      } else {
        score.push("absent");
        if (!absentCharArray.includes(char)) absentCharArray.push(char);
      }
    }

    console.log(score);
    let sc = {
      type: "score",
      word,
      score,
      presentCharArray,
      absentCharArray,
      correctCharArray,
    };
    setScore(sc);
  };

  const enterCurrentText = (word) => {
    let boardWords = boardData.boardWords;
    let rowIndex = boardData.rowIndex;
    boardWords[rowIndex] = word;
    let newBoardData = {
      ...boardData,
      boardWords: boardWords,
    };
    console.log(newBoardData);
    setBoardData(newBoardData);
  };

  const handleKeyPress = (key) => {
    if (boardData.rowIndex > 5 || boardData.status === "WIN") return;
    if (key === "ENTER") {
      if (charArray.length === 5) {
        let word = charArray.join("").toLowerCase();
        if (!wordList[word.charAt(0)].includes(word)) {
          handleError();
          handleMessage("Not in word list");
          return;
        }
        enterBoardWord(word);
        setCharArray([]);
      } else {
        handleMessage("Not enough letters");
      }
      return;
    }
    if (key === "⌫") {
      charArray.splice(charArray.length - 1, 1);
      setCharArray([...charArray]);
    } else if (charArray.length < 5) {
      charArray.push(key);
      setCharArray([...charArray]);
    }
    enterCurrentText(charArray.join("").toLowerCase());
  };

  return (
    <div className="gamecontainer">
      <div className="top">
        <div className="points">Points: {points}</div>

        <div className="title">Wordl3.app</div>
        {/* <div className="reset-board" onClick={resetBoard}>
          {"\u27f3"}
        </div> */}
        <ConnectWallet
          hideTestnetFaucet={false}
          btnTitle="Login"
          theme={"dark"}
          className="walletbtn"
          modalSize={"compact"}
          detailsBtn={() => {
            return (
              <button className="connectedbtn">
                {address?.substring(0, 4)}...{address?.slice(-3)}
              </button>
            );
          }}
        />
      </div>
      {message && <div className="message">{message}</div>}
      {hint && <div className="message">{hint}</div>}
      <div className="cube">
        {[0, 1, 2, 3, 4, 5].map((row, rowIndex) => (
          <div
            className={`cube-row ${
              boardData && row === boardData.rowIndex && error && "error"
            }`}
            key={rowIndex}
          >
            {[0, 1, 2, 3, 4].map((column, letterIndex) => (
              <div
                key={letterIndex}
                className={`letter ${
                  boardData && boardData.boardRowStatus[row]
                    ? boardData.boardRowStatus[row][column]
                    : ""
                }`}
              >
                {boardData &&
                  boardData.boardWords[row] &&
                  boardData.boardWords[row][column]}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="bottom">
        <OnScreenKeyboard
          boardData={boardData}
          handleKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
}
