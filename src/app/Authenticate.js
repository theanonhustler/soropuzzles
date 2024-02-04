import {
  ThirdwebProvider,
  ConnectWallet,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  embeddedWallet,
} from "@thirdweb-dev/react";

export default function Authenticate() {
  return (

      <ConnectWallet theme={"light"} modalSize={"compact"} />
    
  );
}
