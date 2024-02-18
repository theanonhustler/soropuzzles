import Modal from "@mui/material/Modal";
import React, { useState, useRef } from "react";
import swapicon from "../assets/swap_arrow.svg";
import closeicon from "../assets/close_help.svg";
import plusicon from "../assets/plus.svg";
import downicon from "../assets/down.svg";
import fwicon from "../assets/fw.svg";
import upicon from "../assets/up.svg";
import copyicon from "../assets/copy.svg";

import generateicon from "../assets/generate.svg";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";

export default function GenerateWallet({
  showWallet,
  setShowWallet,
  userAddress,
  setUserAddress,
  stellarSecret,
  setStellarSecret,
}) {
  const [sellpoints, setSellPoints] = useState(50);
  const [buygameplays, setBuyGameplays] = useState(5);
  const tryWalletGenerate = async () => {
    // https://backend.sorobix.xyz/api/account
    const response = await fetch(`https://backend.sorobix.xyz/api/account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "soropuzzles" }),
    });
    if (response.ok) {
      toast.success("Stellar Wallet created successfully. Happy puzzling!")
      const walletData = await response.json();
      console.log(walletData);
      localStorage.setItem(
        "userId",
        walletData.data.GenerateAccountResponse.public_key
      );
      localStorage.setItem(
        "userSecret",
        walletData.data.GenerateAccountResponse.private_key
      );

      setUserAddress(walletData.data.GenerateAccountResponse.public_key);
      setStellarSecret(walletData.data.GenerateAccountResponse.private_key);
    }
  };

  return (
    <Modal
      open={showWallet}
      aria-labelledby="refer"
      aria-describedby="referring"
      className="align-middle justify-center items-center outline-none justify-items-center flex h-screen"
    >
      <div
        style={{ height: "300px" }}
        className="outline-none w-72 flex flex-col justify-center items-center rounded-xl relative"
      >
        <div
          onClick={() => {
            setShowWallet(false);
          }}
          className="close"
        >
          <Image className="" src={closeicon} alt="copy" />{" "}
        </div>
        <div className="walletc">
          <div className="walletc_title">
            <Image src={generateicon} alt="generate" />
          </div>
          <div className="walletc_subtitle">
            <div>Create a stellar wallet below</div>
            <div>to start earning points.</div>
          </div>
          <div className="walletc_con">
            {!userAddress && (
              <div onClick={tryWalletGenerate} className="walletc_btn">
                Create Stellar Wallet
              </div>
            )}
            {userAddress && (
              <>
                <div className="walletc_inputc">
                  <div className="walletc_inputc_input">
                    {userAddress?.substring(0, 16)}...
                  </div>
                  <Image
                    className="walletc_inputc_img"
                    src={copyicon}
                    alt="copy"
                  />
                </div>
                <div className="walletc_inputc">
                  <div className="walletc_inputc_input">
                    {stellarSecret?.substring(0, 16)}...
                  </div>
                  <Image
                    className="walletc_inputc_img"
                    src={copyicon}
                    alt="copy"
                  />
                </div>
              </>
            )}
          </div>
          <div className="walletc_alert">Freighter Support Coming Soon</div>
        </div>
      </div>
    </Modal>
  );
}
