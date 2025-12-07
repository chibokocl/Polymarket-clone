import React from "react";
import Link from "next/link";
import Web3 from "web3";
import Img from "next/image";
import HeroChart from "./HeroChart";
import { MarketProps } from "../pages";
import { CATEGORY_COLORS } from "../utils/marketMetadata";

interface Props {
  market: MarketProps;
}

export const HeroSection: React.FC<Props> = ({ market }) => {
  const totalAmountNum = parseFloat(
    Web3.utils.fromWei(market.totalAmount || "0", "ether")
  );
  const totalYesNum = parseFloat(
    Web3.utils.fromWei(market.totalYes || "0", "ether")
  );
  const totalNoNum = parseFloat(
    Web3.utils.fromWei(market.totalNo || "0", "ether")
  );
  
  const yesPct =
    totalAmountNum > 0
      ? ((totalYesNum / totalAmountNum) * 100).toFixed(0)
      : "50"; // Default to 50 if no volume

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col lg:flex-row mb-8">
      {/* Left Side: Info & Outcomes */}
      <div className="w-full lg:w-2/5 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden relative">
               <Img
                src={`https://ipfs.infura.io/ipfs/${market.imageHash}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-[10px] uppercase font-bold tracking-wider ${
                  CATEGORY_COLORS[market.category || "General"]?.replace("bg-", "text-").replace("text-", "text-") || "text-gray-500"
                }`}
              >
                {market.category || "Featured"}
              </span>
              <Link href={`/market/${market.id}`}>
                <h1 className="text-xl font-bold text-gray-900 leading-tight cursor-pointer hover:underline">
                  {market.title}
                </h1>
              </Link>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            {/* Yes Outcome Tile */}
            <Link href={`/market/${market.id}`}>
              <div className="group cursor-pointer flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-green-200 group-hover:text-green-800 transition-colors">
                    Y
                  </div>
                  <span className="font-semibold text-gray-900">Yes</span>
                </div>
                <span className="text-xl font-bold text-gray-900 group-hover:text-green-700 number-mono">{yesPct}%</span>
              </div>
            </Link>

            {/* No Outcome Tile */}
            <Link href={`/market/${market.id}`}>
              <div className="group cursor-pointer flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 group-hover:bg-blue-200 group-hover:text-blue-800 transition-colors">
                    N
                  </div>
                  <span className="font-semibold text-gray-900">No</span>
                </div>
                <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700 number-mono">{100 - parseInt(yesPct)}%</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4">
           <div className="flex items-center justify-between text-xs text-gray-500">
             <span>Vol: <span className="font-mono text-gray-900 font-medium">${totalAmountNum.toFixed(2)}</span></span>
           </div>
        </div>
      </div>

      {/* Right Side: Chart */}
      <div className="w-full lg:w-3/5 p-6 relative flex flex-col">
        <div className="flex justify-end mb-2">
             <span className="flex items-center text-green-600 text-xs font-bold uppercase tracking-wider">
               <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
               Live Probability
             </span>
        </div>
        <div className="flex-grow w-full min-h-[250px]">
          <HeroChart questionId={market.id} />
        </div>
      </div>
    </div>
  );
};
