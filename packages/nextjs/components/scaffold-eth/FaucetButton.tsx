import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import K from "../../constants";
import walletIcon from "../../public/assets/wallet.svg";

export const FaucetButton = () => {
  const [visible, toggleVisibility] = useState(false);

  const handleClick = async () => {
    toggleVisibility(!visible);
  };

  return (
    <div className="">
      <button className="gradient-bg px-3 py-3 rounded-full border border-[#23CEFD]" onClick={handleClick}>
        <Image src={walletIcon} className="h-8 w-8" alt="wallet icon" />
      </button>
      <div
        className={`${
          visible ? "flex" : "hidden"
        } flex-col bg-[#030434] text-white z-20 absolute border border-[#23CEFD] px-5  right-15 m-3 `}
      >
        {K.USER.map(item => (
          <Link href={item.link} key={item.name}>
            <div className="flex  gap-4 items-center ">
              <Image src={item.icon} alt={item.name} className="w-6 h-6 " width={10} height={10} />
              <p className="text-sm">{item.name} </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
