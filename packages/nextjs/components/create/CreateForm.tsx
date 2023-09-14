import { useState } from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const CreateForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [totalSupply, setTotalSupply] = useState(0);
  const [pricePerToken, setPricePerToken] = useState(0);
  const [isShared, setIsShared] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "AXMarketPlaceTestable",
    functionName: "mintAsset",
    args: [title, description, category, BigInt(totalSupply), BigInt(18), BigInt(pricePerToken), isShared, isApproved],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <form onSubmit={() => writeAsync()}>
      <div className="grid grid-cols-2 gap-16">
        <div className="w-full flex flex-col m-5 gap-5">
          <label className="text-white" htmlFor="name">
            Name
          </label>
          <input
            required
            id="name"
            placeholder="Type the name of your asset here"
            onChange={e => setTitle(e.target.value)}
            className="rounded-md bg-[#030434] border border-[#23CEFD]  px-4 py-3 w-full"
          />
        </div>
        <div className="w-full flex flex-col m-5 gap-5">
          <label className="text-white" htmlFor="name">
            Choose Category
          </label>
          <select
            required
            onChange={e => setCategory(e.target.value)}
            className="rounded-md bg-[#030434] text-white border border-[#23CEFD]  px-4 py-3 w-full"
          >
            <option value="">-----choose-----</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Arts">Arts</option>
            <option value="Furniture">Furniture</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-16">
        <div className="w-full flex flex-col m-5 gap-5">
          <label className="text-white" htmlFor="name">
            Description
          </label>
          <textarea
            required
            rows={6}
            id="description"
            placeholder="Type the description of your asset here"
            onChange={e => setDescription(e.target.value)}
            className="rounded-md bg-[#030434] border border-[#23CEFD]  px-4 py-3 w-full"
          />
        </div>
        <div>
          <div className="w-full flex flex-col m-5 gap-5">
            <label className="text-white">Asset Type</label>
            <select
              required
              onChange={e => (Number(e.target.value) == 0 ? setIsShared(true) : setIsShared(false))}
              className="rounded-md bg-[#030434] text-white border border-[#23CEFD]  px-4 py-3 w-full"
            >
              <option value="">-----Choose Asset Type----</option>
              <option value={0}>Fungible</option>
              <option value={1}>Non-Fungible</option>
            </select>
          </div>
          <div className="w-full flex flex-col m-5 gap-5">
            <label className="text-white" htmlFor="name">
              Total supply
            </label>
            <input
              required
              type="number"
              onChange={e => setTotalSupply(Number(e.target.value))}
              className="rounded-md bg-[#030434] border border-[#23CEFD]  px-4 py-3 w-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-16 text-white">
        <div className="w-full flex flex-col m-5 gap-5">
          <label className="text-white" htmlFor="name">
            Price per Token
          </label>
          <input
            required
            type="number"
            onChange={e => setPricePerToken(Number(e.target.value))}
            className="rounded-md bg-[#030434] border border-[#23CEFD]  px-4 py-3 w-full"
          />
        </div>
        <div className="w-full flex flex-col m-8 gap-5">
          <input required type="checkbox" className="w-10 h-10 " onChange={() => setIsApproved(!isApproved)} /> By
          clicking, you agree to approve us as an operator. Also, you consent to our terms and policies.
        </div>
      </div>

      <div className="w-full justify-center flex my-16">
        <button
          disabled={isLoading}
          className="gradient-bg ring ring-[#23CEFD] text-xl font-medium w-1/2 py-4 rounded-md text-white "
        >
          {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <>Create Asset</>}
        </button>
      </div>
    </form>
  );
};
