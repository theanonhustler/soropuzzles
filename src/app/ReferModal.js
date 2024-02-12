import Modal from "@mui/material/Modal";
import React, { useState , useRef} from "react";
import copyicon from "../assets/copy.svg";
import closeicon from "../assets/close_refer.svg";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import OtpInput from "react-otp-input";

export default function ReferModal({ showRefer, setShowRefer, referralCode }) {
 const [referCode, setReferCode] = useState("");


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
            {referralCode}
          </div>{" "}
          <div className="referc_copyc">
            <Image className="h-4 w-4" src={copyicon} alt="copy" />{" "}
            <div
              onClick={() =>
                navigator.clipboard.writeText(referralCode)
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
