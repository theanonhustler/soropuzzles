import { useEffect } from "react";
import { keys } from "./constants";


const OnScreenKeyboard = ({ boardData, handleKeyPress }) => {
  function handleKeyboard(key) {
    if (key.key === "Enter") handleKeyPress("ENTER");
    if (key.key === "Backspace") handleKeyPress("⌫");
    if (key.key.length === 1 && key.key.toLowerCase() !== key.key.toUpperCase())
      handleKeyPress(key.key.toUpperCase());
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [handleKeyPress]);

  return (
    <div className="keyboard-rows">
      {keys.map((item, index) => (
        <div className="row" key={index}>
          {item.map((key, keyIndex) => (
            <button
              key={keyIndex}
              className={`key_btn ${key === "ENTER" ? "key-enter" : ""} ${
                key === "ENTER" || key === "\u232b" ? "key-special" : ""
              } ${
                boardData &&
                boardData.correctCharArray.includes(key.toUpperCase())
                  ? "key-correct"
                  : boardData &&
                    boardData.presentCharArray.includes(key.toUpperCase())
                  ? "key-present"
                  : boardData &&
                    boardData.absentCharArray.includes(key.toUpperCase())
                  ? "key-absent"
                  : ""
              } `}
              onClick={() => {
                handleKeyPress(key);
              }}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default OnScreenKeyboard;
