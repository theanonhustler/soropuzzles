"use client";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { mainnet } from "viem/chains";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "1dbd4cfa0a116a8e741e0e548a3c17da";

// 2. Create wagmiConfig
const metadata = {
  name: "Wordl3",
  description: "Just connect and get wordling",
  url: "https://wordl3.app",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export function Web3Modal({ children }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
