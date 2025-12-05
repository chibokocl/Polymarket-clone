import Img from "next/image";
import React from "react";
import Web3 from "web3";

interface Props {
  id: string;
  title: string;
  imageHash: string;
  totalAmount: string;
  onYes: () => void;
  onNo: () => void;
}

export const AdminMarketCard: React.FC<Props> = ({
  title,
  totalAmount,
  onYes,
  onNo,
  imageHash,
}) => {
  return (
    <div className="w-full overflow-hidden my-2">
      <div className="flex flex-col card-animate border border-cobalt-soft rounded-2xl p-5 cursor-pointer bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex flex-row space-x-5 pb-4">
          <div className="h-w-15 rounded-full bg-cyanbrand-soft flex items-center justify-center overflow-hidden">
            <Img
              src={`https://ipfs.infura.io/ipfs/${imageHash}`}
              className="rounded-full"
              width={55}
              height={55}
            />
          </div>
          <span className="text-lg font-semibold text-gray-900">{title}</span>
        </div>
        <div className="flex flex-row flex-nowrap justify-between items-center">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-light">
              Total Liquidity
            </span>
            <span className="text-base number-mono text-gray-900">
              {parseFloat(Web3.utils.fromWei(totalAmount, "ether")).toFixed(2)}{" "}
              POLY
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-light">Ending In</span>
            <span className="text-base number-mono text-gray-900">
              12 Days
            </span>
          </div>
          <div className="flex flex-row space-x-2 items-end">
            <button
              className="py-1.5 px-3 rounded-full bg-cobalt text-white text-xs font-semibold hover:bg-lapis shadow-brand-card"
              onClick={onYes}
            >
              Resolve YES
            </button>
            <button
              className="py-1.5 px-3 rounded-full bg-cobalt text-white text-xs font-semibold hover:bg-lapis shadow-brand-card"
              onClick={onNo}
            >
              Resolve NO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
