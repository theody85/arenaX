import Image from "next/image";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import Fade from "react-reveal/Fade";
import Jump from "react-reveal/Jump";
import Slide from "react-reveal/Slide";
import { MetaHeader } from "~~/components/MetaHeader";
import art from "~~/public/assets/art.webp";
import furniture from "~~/public/assets/furniture.png";
import hero1 from "~~/public/assets/hero-1.png";
import hero2 from "~~/public/assets/hero-2.png";
import hero3 from "~~/public/assets/hero-3.png";
import nft1 from "~~/public/assets/nft1.png";
import nft2 from "~~/public/assets/nft2.png";
import nft3 from "~~/public/assets/nft3.png";
import nft4 from "~~/public/assets/nft4.png";
import others from "~~/public/assets/others.webp";
import real from "~~/public/assets/real.png";

const categories = [
  {
    imageUrl: real,
    name: "Real Estate",
    alt: "real-estate",
    url: "/category/real-estate",
  },
  {
    imageUrl: art,
    name: "Art",
    alt: "art",
    url: "/category/art",
  },
  {
    imageUrl: furniture,
    name: "Furniture",
    alt: "furniture",
    url: "/category/furniture",
  },
  {
    imageUrl: others,
    name: "Othes",
    alt: "others",
    url: "/category/others",
  },
] as const;

const NFT101 = [
  {
    title: "What is an NFT?",
    imageUrl: nft1,
    url: "/",
  },
  {
    title: "How to buy an NFT",
    imageUrl: nft2,
    url: "/",
  },
  {
    title: "What is minting?",
    imageUrl: nft3,
    url: "/",
  },
  {
    title: "How to stay protected in web3",
    imageUrl: nft4,
    url: "/",
  },
] as const;

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="flex w-full justify-between relative">
          <div className="flex flex-col gap-y-4">
            <Fade>
              <div className="font-michroma text-white text-7xl lg:w-2/3nline-flex lg:leading-normal">
                NFT MARKET PLACE 🔥
              </div>
            </Fade>
            <Slide up>
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
            </Slide>
            <Slide up>
              <h3 className="text-white text-2xl font-semibold tracking-wide">AND DISCOVER RARE DIGITAL ITEMS</h3>
            </Slide>
          </div>
          <div className="w-full mr-12 relative">
            <Jump>
              <Image src={hero1} alt="hero" className="absolute top-0 right-0 z-50" width={300} height={300} />
              <Image src={hero2} className="absolute -top-6 right-24 z-40" alt="hero" width={300} height={300} />
              <Image src={hero3} className="absolute -top-11 right-52 z-30" alt="hero" width={300} height={300} />
            </Jump>
          </div>
        </div>

        <Slide up>
          <div className="w-full flex items-center justify-center gap-x-8 mt-12 lg:mt-24">
            <button className="gradient-bg font-michroma uppercase text-xl px-12 py-4 text-white border border-[#23CEFD] rounded-xl">
              discover
            </button>
            <button
              className="font-michroma uppercase text-xl px-12 py-4 bg-transparent text-white border border-[#23CEFD] rounded-xl"
              onClick={() => router.push("/create")}
            >
              create
            </button>
          </div>
        </Slide>
      </div>

      <section className="flex flex-col flex-grow py-[35vh] bg-transparent gap-y-28">
        <div>
          <Fade>
            <h1 className="font-michroma text-3xl mb-12 text-white">Explore Categories</h1>
          </Fade>
          {
            <div className="flex flex-col lg:flex-row gap-x-8 gap-y-8">
              {categories.map((category, idx) => (
                <Fade key={idx}>
                  <div
                    className="card card-compact w-96 bg-transparent shadow-xl border-2 border-[#23CEFD] cursor-pointer"
                    key={idx}
                    onClick={() => router.push(category.url)}
                  >
                    <figure>
                      <Image
                        src={category.imageUrl}
                        alt={category.alt}
                        className="transition duration-300 ease-in-out hover:scale-110 cursor-pointer"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title text-white text-2xl mt-4">{category.name}</h2>
                    </div>
                  </div>
                </Fade>
              ))}
            </div>
          }
        </div>

        <div>
          <div className="flex items-center justify-between  mb-12">
            <Fade>
              <h1 className="font-michroma text-3xl text-white">NFT 101</h1>
            </Fade>
            <Jump>
              <button className="gradient-bg font-michroma uppercase text-xl px-12 py-4 text-white border border-[#23CEFD] rounded-xl">
                learn more
              </button>
            </Jump>
          </div>
          {
            <div className="flex flex-col lg:flex-row gap-x-8 gap-y-8">
              {NFT101.map((category, idx) => (
                <Fade key={idx}>
                  <div className="card card-compact w-96 bg-transparent shadow-xl border-2 border-[#23CEFD]" key={idx}>
                    <figure>
                      <Image
                        src={category.imageUrl}
                        alt={category.title}
                        className="transition duration-300 ease-in-out hover:scale-110 cursor-pointer"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title text-white text-2xl mt-4">{category.title}</h2>
                    </div>
                  </div>
                </Fade>
              ))}
            </div>
          }
        </div>
      </section>
    </>
  );
};

export default Home;

// Categories are Real Estate, Art, Furniture and Others

{
  /* <div className="card card-compact w-96 bg-transparent shadow-xl border-2 border-[#23CEFD]">
<figure>
  <Image src={shoe} alt="Shoes" />
</figure>
<div className="card-body">
  <h2 className="card-title">Shoes!</h2>
</div>
</div> */
}
