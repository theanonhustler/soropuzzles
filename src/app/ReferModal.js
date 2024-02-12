import Modal from "@mui/material/Modal";
import React, { useState , useRef} from "react";
import copyicon from "../assets/copy.svg";
import closeicon from "../assets/close_refer.svg";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import OtpInput from "react-otp-input";

export default function ReferModal({ showRefer, setShowRefer }) {
  const [data, setData] = useState("No result");
  const inputsRef = useRef([]);
  const [inputValues, setInputValues] = useState(Array(5).fill(""));
 const [referCode, setReferCode] = useState("");
  const handleInputChange = (index, event) => {
    const { value } = event.target;
    const newValue = value.toUpperCase(); // Convert input value to uppercase
    const newInputValues = [...inputValues];
    newInputValues[index] = newValue;
    setInputValues(newInputValues);
  };
  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("Text");
    console.log(pasteData);
    const newInputValues = pasteData.slice(0, 5).toUpperCase().split("");
    setInputValues(
      newInputValues.concat(Array(5 - newInputValues.length).fill(""))
    );
    console.log(newInputValues);
  };
  const handleKeyPress = (index, event) => {
    if (event.key === "Backspace" && index > 0 && inputValues[index] === "") {
      // Handle backspace and focus on the previous input
      inputsRef.current[index - 1].focus();
    } else if (
      event.key !== "Backspace" &&
      index < inputValues.length - 1 &&
      inputValues[index] !== ""
    ) {
      // Handle other keys (except backspace) and focus on the next input
      inputsRef.current[index + 1].focus();
    }
  };
    const handleChange = (code) => {
      setReferCode(code.toUpperCase());
    };
  return (
    <Modal
      open={showRefer}
      aria-labelledby="refer"
      aria-describedby="referring"
      className="align-middle justify-center items-center outline-none justify-items-center flex h-screen"
    >
      <div className="outline-none h-96 w-72 flex flex-col justify-center items-center rounded-xl relative">
        <div
          onClick={() => {
            setShowRefer(false);
          }}
          className="close"
        >
          <Image className="" src={closeicon} alt="copy" />{" "}
        </div>
        <div className="referc">
          <div className="referc_title">Unlock More Gameplays</div>
          <div className="referc_subtitle">Invite frens to 3lax</div>
          <div
            onClick={() =>
              navigator.clipboard.writeText("Copy this text to clipboard")
            }
            className="referc_codec"
          >
            3LAX42
          </div>{" "}
          <div className="referc_copyc">
            <Image className="h-4 w-4" src={copyicon} alt="copy" />{" "}
            <div
              onClick={() =>
                navigator.clipboard.writeText("Copy this text to clipboard")
              }
              className="ml-1 opacity-70"
            >
              Copy & Share
            </div>
          </div>
        </div>
        <div className="referredc">
          <div className="referredc_title">Unlock More Gameplays</div>
          <div className="referredc_subtitle">Invite frens to 3lax</div>
          <div className="referredc_inputc">
            {/* {inputValues.map((value, index) => (
              <input
                key={index}
                ref={(input) => (inputsRef.current[index] = input)}
                type="text"
                maxLength={1}
                className="referredc_input"
                value={value}
                onChange={(event) => handleInputChange(index, event)}
                onKeyDown={(event) => handleKeyPress(index, event)}
                onPaste={handlePaste}
              />
            ))} */}
            <OtpInput
              value={referCode}
              onChange={handleChange}
              numInputs={5}
              inputStyle={"referredc_input"}
              shouldAutoFocus={true}
              renderSeparator={<span className="w-1"> </span>}
              renderInput={(props) => <input {...props} />}
            />
            <button className="referredc_enter">{`->`}</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
