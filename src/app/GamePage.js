"use client";

import { useState, useEffect } from "react";
import { wordList } from "./config";
// import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import OnScreenKeyboard from "./OnScreenKeyboard";
import { endpoint } from "../utils/endpoint";
import { ConnectWallet, useUser, useAddress } from "@thirdweb-dev/react";
import staricon from "../assets/star-icon.svg";
import laxlogo from "../assets/3lax.svg";
import Image from "next/image";
// import enter from "/sounds/enter.mp3";
// import back from "/sounds/back.mp3";
// import keysound from "/sounds/key.mp3";
import { ToastContainer, toast } from "react-toastify";
import useSound from "use-sound";
let correctCharArray = [];
let presentCharArray = [];
let absentCharArray = [];

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
  const [wordId, setWordId] = useState();
  const [refreshTimer, setRefreshTimer] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [userAddress, setUserAddress] = useState(
    
  );
  const [playkey] = useSound("/sounds/key.mp3");
  const [playenter] = useSound("/sounds/enter.mp3");
  const [playback] = useSound("/sounds/back.mp3");
  useEffect(() => {
    console.log(address);

    if (address) {
      localStorage.setItem("userId", address);
      authenticateWithWeb3(address);
      setUserAddress(address);
      getData();
      resetBoard();
    } else {
      localStorage.removeItem("userId");
      getData();
      setUserAddress(null);
    }
  }, [address]);
  useEffect(() => {
    if (refresh) {
      const timer = setTimeout(() => {
        if (refreshTimer === 0) {
          resetBoard();
          getData();
          // setRefreshTimer(5);
        } else {
          setRefreshTimer((prevTimer) => prevTimer - 1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [refreshTimer]);

  async function getAllCharacters() {
    const userId = localStorage.getItem("userId");

    const data = await fetch(`/api/word`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: userId }),
    });
    if (!data.ok) {
      throw new Error("Failed to fetch data");
    }

    return data.json();
  }
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
      setPoints(points);
    }
  };

  const checkUserWord = async (word) => {
    const userId = localStorage.getItem("userId");
    const response = await fetch(`/api/checkword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wordId, word, userId }),
    });

    if (response.ok) {
      const score = await response.json();
      if (score.status === "WIN" && score.loggedIn) {
        setPoints(score.points);
      }
      if (score.status === "WIN" && !score.loggedIn) {
        setPoints(points + 1);
      }
      setScore(score);
    }
  };
  const resetBoard = () => {
    let newBoardData = {
      ...boardData,
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
      status: score.status,
    });
    if (score.status === "WIN") {
      setRefreshTimer(5);
      setRefresh(true);
    }
  }, [score]);

 
  const getData = async () => {
    const randomCryptoWord = await getAllCharacters();
    if (randomCryptoWord.completed) {
      toast.success(`All words solved, now 3laxxx!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      setHint(randomCryptoWord?.hint);
      setWordId(randomCryptoWord?.id);
      setRefresh(false);
      if (!boardData) {
        let newBoardData = {
          ...boardData,
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
    }
  };
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

  const handleKeyPress = async (key) => {
    if (boardData.rowIndex > 5) {
      toast.error("Better luck next time!");
      setRefresh(true);
      setRefreshTimer(5);
    }
    if (boardData.status === "WIN") return;
    if (key === "ENTER") {
      playenter();
      if (charArray.length === 5) {
        let word = charArray.join("").toLowerCase();
        if (!wordList[word.charAt(0)].includes(word)) {
          handleError();
          handleMessage("Not in word list");
          return;
        }
        setCharArray([]);
        await checkUserWord(word);
      } else {
        handleMessage("Not enough letters");
      }
      return;
    }
    if (key === "⌫") {
      playback();
      charArray.splice(charArray.length - 1, 1);
      setCharArray([...charArray]);
    } else if (charArray.length < 5) {
      playkey();

      charArray.push(key);
      setCharArray([...charArray]);
    }
    enterCurrentText(charArray.join("").toUpperCase());
  };

  return (
    <div className="gamecontainer">
      <div className="top">
        <div className="points">
          <Image className="w-4" src={staricon} alt="star icon" />
          {points} pts
        </div>

        {/* <div className="reset-board" onClick={resetBoard}>
          {"\u27f3"}
        </div> */}
        <ConnectWallet
          hideTestnetFaucet={false}
          btnTitle="LOG IN"
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
      <div className="title">
        <Image className="w-full" src={laxlogo} alt="logo" />
      </div>
      <div className="flex flex-col items-center">
        <div className="subtitle">{hint && `Hint: ${hint}`}</div>{" "}
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
      </div>

      {/* {message && <div className="message">{message}</div>}
      {hint && <div className="message">{hint}</div>} */}

      <div className="bottom">
        <OnScreenKeyboard
          boardData={boardData}
          handleKeyPress={handleKeyPress}
        />
        {refreshTimer !== 0 && (
          <div className="refresh">
            Refreshing board in {refreshTimer} seconds
          </div>
        )}
      </div>
    </div>
  );
}
