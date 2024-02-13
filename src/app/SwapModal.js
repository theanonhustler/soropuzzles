import Modal from "@mui/material/Modal";
import React, { useState, useRef } from "react";
import swapicon from "../assets/swap_arrow.svg";
import closeicon from "../assets/close_help.svg";
import plusicon from "../assets/plus.svg";
import downicon from "../assets/down.svg";
import fwicon from "../assets/fw.svg";
import upicon from "../assets/up.svg";
import minusicon from "../assets/minus.svg";
import convertbtn from "../assets/convert_button.svg";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";

export default function SwapModal({
  showSwap,
  setShowSwap,
  points,
  setPoints,
  gameplays,
  setGamePlays,
  userAddress
}) {
  const [sellpoints, setSellPoints] = useState(50);
  const [buygameplays, setBuyGameplays] = useState(5);
  const handleIncrement = () => {
    if (sellpoints === 50) {
      setSellPoints(100);
      setBuyGameplays(12);
    } else if (sellpoints === 100) {
      setSellPoints(200);
      setBuyGameplays(25);
    } else if (sellpoints === 200) {
      setSellPoints(500);
      setBuyGameplays(75);
    }
  };

  const handleDecrement = () => {
    if (sellpoints === 100) {
      setSellPoints(50);
      setBuyGameplays(5);
    } else if (sellpoints === 200) {
      setSellPoints(100);
      setBuyGameplays(12);
    } else if (sellpoints === 500) {
      setSellPoints(200);
      setBuyGameplays(25);
    }
  };
  const handleConvert = async () => {
    try {
      const response = await fetch("/api/convertpoints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sellpoints, userAddress }),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        toast.success("Voila! Game Begins");
        setPoints(responseData.points);
        setGamePlays(responseData.gameplays);
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
      open={showSwap}
      aria-labelledby="refer"
      aria-describedby="referring"
      className="align-middle justify-center items-center outline-none justify-items-center flex h-screen"
    >
      <div
        style={{ height: "450px" }}
        className="outline-none w-72 flex flex-col justify-center items-center rounded-xl relative"
      >
        <div
          onClick={() => {
            setShowSwap(false);
          }}
          className="close"
        >
          <Image className="" src={closeicon} alt="copy" />{" "}
        </div>
        <div className="swapc">
          <div className="swapc_title">Point-Play Economics</div>
          <div className="swapc_subtitle">
            <div>How to keep 3laxing</div>
            <div>more & more everyday</div>
          </div>
          <div className="swapc_infoc">
            <div className="swapc_infoc_detail">
              <Image className="h-4 w-4" src={downicon} alt="arrow" />
              Each guess(6 chances per word) costs you -1 play.
            </div>
            <div className="swapc_infoc_detail">
              <Image className="h-4 w-4" src={upicon} alt="arrow" />
              Each correct guess earns you 10 points.
            </div>
            <div className="swapc_infoc_detail">
              <Image className="h-4 w-4" src={upicon} alt="arrow" />
              For every referral, you & your frens get 10 points each.
            </div>
            <div className="swapc_infoc_detail">
              <Image className="h-4 w-4" src={fwicon} alt="arrow" />
              You can swap points for plays anytime.
            </div>

            <div className="swapc_infoc_detail">
              <Image className="h-4 w-4" src={fwicon} alt="arrow" />
              {`You're credited with 3 free plays every 24 hours(UTC 00:00)`}
            </div>
          </div>
          <div className="swapc_convertc">
            <div className="flex flex-col">
              <div className="swapc_convertc_box1 inb">
                <Image
                  className="absolute -top-2 left-6 h-5 w-5"
                  src={plusicon}
                  alt="arrow"
                  onClick={handleIncrement}
                />
                <Image
                  className="absolute -bottom-2 left-6 h-5 w-5"
                  src={minusicon}
                  alt="arrow"
                  onClick={handleDecrement}
                />
                <div>{sellpoints}</div>
              </div>
              <div className="balance">Balance: {points} points</div>
            </div>
            <div className="swapc_convertc_box2">
              <Image className="h-12 w-12" src={swapicon} alt="arrow" />
            </div>
            <div className="flex flex-col">
              <div className="swapc_convertc_box3 inb">
                <div>{buygameplays}</div>
              </div>
              <div className="balance">Balance: {gameplays} plays</div>
            </div>
          </div>
          <div
            className={`swapc_convertb ${
              points < sellpoints ? "swapc_convertb_disabled" : ""
            }`}
            onClick={handleConvert}
          >
            <Image className="object-contain" src={convertbtn} alt="arrow" />
          </div>
        </div>
      </div>
    </Modal>
  );
}
