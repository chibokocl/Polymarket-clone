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
    <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col lg:flex-row mb-8">
      {/* Left Side: Info & Outcomes */}
      <div className="w-full lg:w-2/5 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden relative">
               <Img
                src={`https://ipfs.infura.io/ipfs/${market.imageHash}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                CATEGORY_COLORS[market.category || "General"] || "bg-gray-100 text-gray-600"
              }`}
            >
              {market.category || "Featured"}
            </span>
          </div>
          
          <Link href={`/market/${market.id}`}>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight cursor-pointer hover:underline">
              {market.title}
            </h1>
          </Link>
          
          <div className="mt-6 space-y-3">
            {/* Yes Outcome Row */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">
                  👍
                </div>
                <span className="font-semibold text-gray-900">Yes</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold text-green-700 number-mono">{yesPct}%</span>
                <Link href={`/market/${market.id}`}>
                  <button className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition shadow-sm">
                    Buy Yes
                  </button>
                </Link>
              </div>
            </div>

            {/* No Outcome Row */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-sm">
                  👎
                </div>
                <span className="font-semibold text-gray-900">No</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold text-blue-700 number-mono">{100 - parseInt(yesPct)}%</span>
                <Link href={`/market/${market.id}`}>
                  <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm">
                    Buy No
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
           <div className="flex items-center justify-between text-xs text-gray-500">
             <span>Volume: <span className="font-mono text-gray-900 font-medium">${totalAmountNum.toFixed(2)}</span></span>
             <span className="flex items-center text-green-600 font-medium">
               <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
               Live
             </span>
           </div>
        </div>
      </div>

      {/* Right Side: Chart */}
      <div className="w-full lg:w-3/5 p-6 bg-gray-50/50 relative">
        <div className="absolute top-6 right-6 z-10">
             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Probability History</span>
        </div>
        <div className="h-[300px] w-full">
          <HeroChart questionId={market.id} />
        </div>
      </div>
    </div>
  );
};
