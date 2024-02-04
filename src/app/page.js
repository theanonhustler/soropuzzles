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
      <GamePage/>
    </ThirdwebProvider>
  );
};
