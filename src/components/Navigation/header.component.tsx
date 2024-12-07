import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import React from "react";
import { ConnectWalletButton } from "../Buttons/connect-wallet-button.component";

export const Header = () => {
  return (
    <div className="w-full border-b border-[#2d2d2d] flex items-center justify-between md:px-10 p-5 py-5">
      <Link href={"/"} className="text-xl md:text-3xl 2xl:text-4xl font-bold">
        AI-Trader
      </Link>
<div className="flex gap-3"> <li className="text-none"><a href="/ai">AI Assistant</a></li><li><a href="/trade">Trade</a></li></div>
      <ConnectWalletButton />
    </div>
  );
};
