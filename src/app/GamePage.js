"use client";

import { useState, useEffect } from "react";
import { wordList } from "./config";
// import { toString as uint8ArrayToString } from "uint8arrays/to-string";
import OnScreenKeyboard from "./OnScreenKeyboard";
import { endpoint } from "../utils/endpoint";
import { ConnectWallet, useUser, useAddress } from "@thirdweb-dev/react";
import staricon from "../assets/star-icon.svg";
import laxlogo from "../assets/3lax.svg";
import refericon from "../assets/refer.svg";
import helpicon from "../assets/help.svg";
import Image from "next/image";
import toast from "react-hot-toast";
import ReferModal from "./ReferModal";
import HelpModal from "./HelpModal";
import SwapModal from "./SwapModal";
import { useRouter } from "next/navigation";

import useSound from "use-sound";

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
  const [userAddress, setUserAddress] = useState();
  const [showRefer, setShowRefer] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSwap, setShowSwap] = useState(true);
  const [playkey] = useSound("/sounds/key.mp3");
  const [playenter] = useSound("/sounds/enter.mp3");
  const [playback] = useSound("/sounds/back.mp3");
  const [referralCode, setReferralCode] = useState("");
  const [referCode, setReferCode] = useState("");
  const [referred, setReferred] = useState(false);
  const [gameplays, setGamePlays] = useState(1);
    const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refer = urlParams.get("refer");

    if (refer) {
      setReferCode(refer);
    }
  }, []);
  useEffect(() => {
    console.log("shshhss", address, typeof address);
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
      const { jwtToken, referralCode, points, referredBy, gameplays } =
        await response.json();
      console.log(jwtToken);

      localStorage.setItem("jwtToken", jwtToken);
      if (referredBy) {
        setReferred(true);
        setReferCode(referredBy);
      }
      setPoints(points);
      setGamePlays(gameplays);
      setReferralCode(referralCode);
    }
  };

  const checkUserWord = async (word) => {
    const userId = localStorage.getItem("userId");
    let tries = boardData.rowIndex + 1;
    const response = await fetch(`/api/checkword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wordId, word, userId, tries }),
    });

    if (response.ok) {
      const score = await response.json();
      console.log("Ssssss",score);
      if (score.bonus) {
        toast.success("Magician indeed! 100 points awarded!");
        setPoints(score.points);
        resetBoard();
      } else {
        if (score.status === "WIN" && score.loggedIn) {
          setPoints(score.points);
          setGamePlays(score.gameplays);
        }
        if (score.status === "LOST" && score.loggedIn) {
          setGamePlays(score.gameplays);
        }
        if (score.status === "WIN" && !score.loggedIn) {
          setPoints(points + 1);
        }
        setScore(score);
      }
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
    console.log("boardData",score);
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
    if (userAddress) {
      if (score.status === "WIN") {
        setRefreshTimer(5);
        setRefresh(true);
      }
      if (rowIndex === 6) {
        toast.error("Better luck next time!");
        setRefreshTimer(5);
        setRefresh(true);
      }
    } else {
      if (score.status === "WIN") {
        toast.success("Woohoo LFG🚀");
      }
      if (rowIndex === 6) {
        toast.error("Better luck next time!");
        resetBoard();
      }
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
    setBoardData(newBoardData);
  };

  const handleKeyPress = async (key) => {
    if (gameplays === 0) {
      toast.error("Buy more gameplays from points or come back tomorrow!");
      return;
    }
    if (!showRefer) {
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
    }
  };

  return (
    <div
      style={{ filter: showRefer || showHelp ? "blur(10px)" : "none" }}
      className="gamecontainer"
    >
      <ReferModal
        showRefer={showRefer}
        setShowRefer={setShowRefer}
        setPoints={setPoints}
        referralCode={referralCode}
        userAddress={userAddress}
        referCode={referCode}
        setReferCode={setReferCode}
        referred={referred}
        setReferred={setReferred}
      />
      <HelpModal showHelp={showHelp} setShowHelp={setShowHelp} />
      <SwapModal
        userAddress={userAddress}
        points={points}
        setPoints={setPoints}
        gameplays={gameplays}
        setGamePlays={setGamePlays}
        showSwap={showSwap}
        setShowSwap={setShowSwap}
      />
      <div className="top">
        <div
          onClick={() => setShowSwap(true)}
          className="flex gap-1 items-center"
        >
          <div className="points">
            <Image className="w-4" src={staricon} alt="star icon" />
            {points} <span className="font-light">pts</span>
          </div>
          <div className="points">
            <Image className="w-4" src={staricon} alt="star icon" />
            {gameplays} <span className="font-light">plays</span>
          </div>
        </div>
        {/* <div className="reset-board" onClick={resetBoard}>
          {"\u27f3"}
        </div> */}
        <div className="flex gap-1 items-center">
          <Image
            onClick={() => {
              setShowHelp(true);
            }}
            className="w-8 h-8 md:w-9 md:h-9"
            src={helpicon}
            alt="refer"
          />
          <Image
            onClick={() => {
              setShowRefer(true);
            }}
            className="w-8 h-8 md:w-9 md:h-9"
            src={refericon}
            alt="refer"
          />
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
          score={score}
          boardData={boardData}
          handleKeyPress={handleKeyPress}
        />
        {refreshTimer !== 0 && (
          <div className="refresh">
            {refreshTimer} seconds to take a screenshot
          </div>
        )}
      </div>
    </div>
  );
}
