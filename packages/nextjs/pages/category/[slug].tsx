import React from "react";
import Image from "next/image";
import Table from "./components/Table";
// import { useRouter } from "next/router";
import Fade from "react-reveal/Fade";
import ante from "~~/public/assets/ante.png";
import ellipse from "~~/public/assets/ellipse.png";
import enta from "~~/public/assets/enta.png";
import likeIcon from "~~/public/assets/like.svg";
import nate from "~~/public/assets/nate.png";
import tene from "~~/public/assets/tene.png";

const topSellers = [
  {
    name: "Ante",
    likes: 500,
    price: "2.0 ETH",
    imageUrl: ante,
    category: "art",
  },
  {
    name: "Enta",
    likes: 500,
    price: "2.0 ETH",
    imageUrl: enta,
    category: "real-estate",
  },
  {
    name: "Nate",
    likes: 500,
    price: "2.0 ETH",
    imageUrl: nate,
    category: "furniture",
  },
  {
    name: "Tene",
    likes: 500,
    price: "2.0 ETH",
    imageUrl: tene,
    category: "others",
  },
] as const;

const Category = () => {
  // const router = useRouter();

  return (
    <div className="w-full">
      <div className="w-full bg-indigo-950/80 rounded-2xl px-8 py-8">
        <Fade>
          <h1 className="text-5xl text-white font-bold mb-12">Trending</h1>
          <div className="flex flex-nowrap items-center justify-between h-full flex-1 gap-x-6">
            {topSellers.map((seller, index) => (
              <div className="card bg-[#040636] shadow-xl w-full border-2 border-[#23CEFD] cursor-pointer" key={index}>
                <div className="py-6 px-8 relative">
                  <div className="border border-[#23CEFD] cursor-pointer text-white flex items-center gap-x-2 px-4 py-1 rounded-xl absolute top-5 right-0 z-50 bg-[#040636]">
                    <Image src={likeIcon} alt="like" /> <span>{seller.likes}</span>
                  </div>
                  <figure className="mb-4 w-full">
                    <Image src={seller.imageUrl} alt={seller.name} className="cursor-pointer w-full" />
                  </figure>
                  <div className="card-body p-0">
                    <div className="flex justify-between items-center w-full mt-4">
                      <h2 className="card-title text-white text-2xl">{seller.name}</h2>
                      <h6 className="text-white font-semibold">{seller.price}</h6>
                    </div>

                    <div className="flex justify-between items-center w-full">
                      <div className="flex">
                        <Image src={ellipse} alt="ellipse" />
                        {seller.name === "Ante" && <Image src={ellipse} alt="ellipse" className="z-10 -ml-6" />}
                      </div>
                      <button className="gradient-bg text-sm px-3 py-1 text-white border border-[#23CEFD] rounded-xl">
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Fade>
      </div>

      <div className="w-full py-[20vh]">
        <Table />
      </div>
    </div>
  );
};

export default Category;
