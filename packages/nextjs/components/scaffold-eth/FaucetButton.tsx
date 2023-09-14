import { useState } from "react";
import Image from "next/image";
import walletIcon from "../../public/assets/wallet.svg";
import { createWalletClient, http, parseEther } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { hardhat } from "wagmi/chains";
import { useAccountBalance, useTransactor } from "~~/hooks/scaffold-eth";

// Number of ETH faucet sends to an address
const NUM_OF_ETH = "1";
const FAUCET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

const localWalletClient = createWalletClient({
  chain: hardhat,
  transport: http(),
});

/**
 * FaucetButton button which lets you grab eth.
 */
export const FaucetButton = () => {
  const { address } = useAccount();
  const { balance } = useAccountBalance(address);

  const { chain: ConnectedChain } = useNetwork();

  const [loading, setLoading] = useState(false);

  const faucetTxn = useTransactor(localWalletClient);

  const sendETH = async () => {
    try {
      setLoading(true);
      await faucetTxn({
        chain: hardhat,
        account: FAUCET_ADDRESS,
        to: address,
        value: parseEther(NUM_OF_ETH),
      });
      setLoading(false);
    } catch (error) {
      console.error("⚡️ ~ file: FaucetButton.tsx:sendETH ~ error", error);
      setLoading(false);
    }
  };

  // Render only on local chain
  if (ConnectedChain?.id !== hardhat.id) {
    return null;
  }

  return (
    <div
      className={
        balance
          ? ""
          : "tooltip tooltip-bottom tooltip-secondary tooltip-open font-bold before:left-auto before:transform-none before:content-[attr(data-tip)] before:right-0"
      }
      data-tip="Grab funds from faucet"
    >
      <button
        className="gradient-bg px-3 py-3 rounded-full border border-[#23CEFD]"
        onClick={sendETH}
        disabled={loading}
      >
        {!loading ? (
          <Image src={walletIcon} className="h-8 w-8" alt="wallet icon" />
        ) : (
          <span className="loading loading-spinner loading-xs"></span>
        )}
      </button>
    </div>
  );
};
