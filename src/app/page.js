"use client";

import GamePage from "./GamePage";
import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  embeddedWallet,
  useLogin,
} from "@thirdweb-dev/react";
import { ToastContainer, toast } from "react-toastify";
import { Toaster } from "react-hot-toast";

import "react-toastify/dist/ReactToastify.css";
export default function Page() {
  return (
    <ThirdwebProvider
      activeChain="ethereum"
      clientId="b9260a726a16fe2e99c538b1827939a7"
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet({ recommended: true }),
        walletConnect(),
        embeddedWallet({
          auth: {
            options: ["google"],
          },
        }),
      ]}
    >
      <GamePage />
      <Toaster position="top-right" />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThirdwebProvider>
  );
}
