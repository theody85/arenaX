import Image from "next/image";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import hero1 from "~~/public/assets/hero-1.png";
import hero2 from "~~/public/assets/hero-2.png";
import hero3 from "~~/public/assets/hero-3.png";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10 h-screen">
        <div className="flex w-full justify-between relative">
          <div className="flex flex-col gap-y-4">
            <div className="font-michroma text-white text-7xl lg:w-2/3nline-flex lg:leading-normal">
              NFT MARKET PLACE 🔥
            </div>

            <div className="flex gap-x-2 w-full">
              <div className="text-white font-michroma text-lg px-3 py-3 rounded-lg bg-transparent border border-[#23CEFD] w-36 text-center">
                #CREATE
              </div>
              <div className="text-white font-michroma text-lg px-3 py-3 rounded-lg bg-transparent border border-[#23CEFD] w-36 text-center">
                #BUY
              </div>
              <div className="text-white font-michroma text-lg px-3 py-3 rounded-lg bg-transparent border border-[#23CEFD] w-36 text-center">
                #SELL
              </div>
            </div>

            <h3 className="text-white text-2xl font-semibold tracking-wide">AND DISCOVER RARE DIGITAL ITEMS</h3>
          </div>
          <div className="w-full">
            <Image src={hero1} alt="hero" className="absolute top-0 right-0 z-50" width={300} height={300} />
            <Image src={hero2} className="absolute -top-6 right-24 z-40" alt="hero" width={300} height={300} />
            <Image src={hero3} className="absolute -top-11 right-52 z-30" alt="hero" width={300} height={300} />
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-x-8 mt-12 lg:mt-24">
          <button className="gradient-bg font-michroma uppercase text-xl px-12 py-4 text-white border border-[#23CEFD] rounded-xl">
            discover
          </button>
          <button className="font-michroma uppercase text-xl px-12 py-4 bg-transparent text-white border border-[#23CEFD] rounded-xl">
            create
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
