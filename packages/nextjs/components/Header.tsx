import React from "react";
import Image from "next/image";
import Link from "next/link";
import Fade from "react-reveal/Fade";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

/**
 * Site header
 */
export const Header = () => {
  return (
    <Fade>
      <div className="navbar bg-[#040636] min-h-0 flex-shrink-0 justify-between px-8 py-8 lg:px-16 lg:py-12 rounded-3xl">
        <div className="navbar-start w-auto lg:w-1/2">
          <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
            <div className="flex relative w-[7.5rem] h-16">
              <Image alt="ArenaX logo" className="cursor-pointer" fill src="/logo.svg" />
            </div>
          </Link>
        </div>
        <div className="navbar-end flex-grow mr-4 gap-x-6 z-50">
          <RainbowKitCustomConnectButton />
          <FaucetButton />
        </div>
      </div>
    </Fade>
  );
};
