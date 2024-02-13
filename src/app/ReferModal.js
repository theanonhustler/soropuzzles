import Modal from "@mui/material/Modal";
import React, { useState, useRef } from "react";
import copyicon from "../assets/copy.svg";
import closeicon from "../assets/close_refer.svg";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";

export default function ReferModal({
  showRefer,
  setShowRefer,
  referralCode,
  userAddress,
  setPoints,
  referCode,
  setReferCode,
  referred,
  setReferred
}) {

  const handleChange = (code) => {
    setReferCode(code.toUpperCase());
  };
  const handleReferSubmit = async () => {
    try {
      const response = await fetch("/api/referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referralCode: referCode, userAddress }),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Referral code submitted successfully");
        console.log(responseData);
        toast.success("Referral Data set successfully");
        setReferred(true);
        setPoints(responseData.points);
      } else {
        const errorData = await response.json();
        if (errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error("Some error occurred, try again!");
        }
      }
    } catch (error) {
      console.error("Error submitting referral code:", error.message);
      toast.error("Some error occured, try again!");
    }
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
            onClick={() => navigator.clipboard.writeText(referralCode)}
            className="referc_codec"
          >
            {referralCode}
          </div>{" "}
          <div className="referc_copyc">
            <Image className="h-4 w-4" src={copyicon} alt="copy" />{" "}
            <div
              onClick={() => navigator.clipboard.writeText(referralCode)}
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
            <OtpInput
              value={referCode}
              onChange={handleChange}
              numInputs={6}
              inputStyle={`referredc_input ${
                referred ? "referredc_input_success" : ""
              }`}
              renderSeparator={<span className="w-1"> </span>}
              renderInput={(props) => <input disabled={referred} {...props} />}
            />
            <button
              onClick={async () => {
                await handleReferSubmit();
              }}
              className={`referredc_enter ${
                referred ? "referredc_enter_disabled" : ""
              }`}
            >{`->`}</button>
          </div>
          <div
            className={`referredc_message ${
              referred ? "referredc_input_success" : ""
            }`}
          ></div>
        </div>
      </div>
    </Modal>
  );
}
