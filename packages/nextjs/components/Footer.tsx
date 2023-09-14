import Image from "next/image";
import Link from "next/link";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-10 mb-11 lg:mb-0">
      <div className="w-full">
        <ul className="menu menu-horizontal w-full flex-nowrap gap-x-8 justify-between">
          <div className="flex flex-col justify-between w-1/3">
            <Link href="/" passHref className="hidden lg:flex items-center gap-2 mr-6 shrink-0">
              <div className="flex relative w-[7.5rem] h-16">
                <Image alt="ArenaX logo" className="cursor-pointer" fill src="/logo.svg" />
              </div>
            </Link>

            <div className="text-white text-base">
              Welcome to ARENAX, where digital uniqueness meets seamless trading. Explore a world of one-of-a-kind
              digital treasures, empower creators, and connect with a vibrant community in the realm of Non-Fungible
              Tokens (NFTs). Dive into the future of digital ownership and creativity with us.
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-2xl text-white font-bold mb-6">Marketplace</p>

            <ul className="text-white text-2xl">
              <li>Explore</li>
              <li>Create</li>
              <li>Blog</li>
            </ul>
          </div>

          <div className="flex flex-col">
            <p className="text-2xl text-white font-bold mb-6">Useful Links</p>

            <ul className="text-white text-2xl">
              <li>Home</li>
              <li>All NFTs</li>
              <li>Collectors</li>
            </ul>
          </div>
          <div className="flex flex-col justify-end items-start gap-2">
            <p className="text-2xl text-white font-bold mb-6">Get the latest NFT update</p>

            <div className="flex flex-nowrap">
              <input
                type="text"
                className="h-full text-white text-xl ring ring-[#23CEFD] bg-transparent rounded-tl-xl rounded-bl-xl rounded-br-none rounded-tr-none"
              />
              <button className="text-2xl px-8 py-4 bg-transparent text-white gradient-bg ring ring-[#23CEFD] rounded-tr-xl rounded-br-xl">
                Send
              </button>
            </div>
          </div>
        </ul>
      </div>

      <div className="w-full mt-20 text-center">
        <p className="text-white text-base font-michroma">© {new Date().getFullYear()} ArenaX. All rights reserved.</p>
      </div>
    </div>
  );
};
