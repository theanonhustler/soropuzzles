import Modal from "@mui/material/Modal";
import React, { useState , useRef} from "react";
import instruction from "../assets/howtobecool.png";
import closeicon from "../assets/close_help.svg";
import Image from "next/image";

export default function HelpModal({ showHelp, setShowHelp }) {
  return (
    <Modal
      open={showHelp}
      aria-labelledby="refer"
      aria-describedby="referring"
      className="align-middle justify-center items-center outline-none justify-items-center flex h-screen"
    >
      <div className="outline-none help flex flex-col justify-center items-center rounded-xl relative">
        <div
          onClick={() => {
            setShowHelp(false);
          }}
          className="close_help"
        >
          <Image className="" src={closeicon} alt="copy" />{" "}
        </div>
        <Image className="object-cover" src={instruction} alt="instructions"/>
      </div>
    </Modal>
  );
}
