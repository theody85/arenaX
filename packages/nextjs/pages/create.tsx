import { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";
import { CreateForm } from "~~/components/create/CreateForm";

const Create: NextPage = () => {
  return (
    <>
      <MetaHeader title="Create Asset | ArenaX" description="Create your token">
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="grid  flex-grow text-white" data-theme="exampleUi">
        <h1 className="text-5xl text-white font-bold mb-5">Mint New Asset</h1>
        <CreateForm />
      </div>
    </>
  );
};
export default Create;
