import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { ContractData } from "~~/components/create/ContractData";

// import { ContractInteraction } from "~~/components/create/CreateForm";

const ExampleUI: NextPage = () => {
  return (
    <>
      <MetaHeader title="ArenaX | Discover NFTs" description="Buy and sell NFTs in various categories.">
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid lg:grid-cols-2 flex-grow" data-theme="exampleUi">
        {/* <ContractInteraction /> */}
        <ContractData />
      </div>
    </>
  );
};

export default ExampleUI;
