
import Link from "next/link";
import React from "react";
import Web3 from "web3";
import { formatCurrency } from "../utils/formatters";
import { MarketProps } from "../pages";
import { CATEGORY_COLORS } from "../utils/marketMetadata";

export const MarketCard: React.FC<MarketProps> = ({
  id,
  title,
  totalAmount,
  totalYes,
  totalNo,
  imageHash,
  category = "General",
  tags = [],
}) => {
  const totalAmountNum = parseFloat(Web3.utils.fromWei(totalAmount, "ether"));
  const totalYesNum = parseFloat(Web3.utils.fromWei(totalYes, "ether"));
  const totalNoNum = parseFloat(Web3.utils.fromWei(totalNo, "ether"));

  const yesPct = totalAmountNum > 0 ? ((totalYesNum / totalAmountNum) * 100).toFixed(0) : "50";
  const noPct = totalAmountNum > 0 ? ((totalNoNum / totalAmountNum) * 100).toFixed(0) : "50";

  return (
    <div className="w-full overflow-hidden my-2">
      <Link href={`/market/${id}`} passHref>
        <div className="flex flex-col h-full bg-white rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow border border-gray-100">
          <div className="flex flex-row space-x-3 pb-2 items-start">
            <div className="w-8 h-8 min-w-[32px] rounded-md bg-gray-100 overflow-hidden relative">
              <img
                src={`https://ipfs.infura.io/ipfs/${imageHash}`}
                className="w-full h-full object-cover"
                alt={title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                {title}
              </span>



              <span className="text-[10px] text-gray-400 mt-1">
                Vol: {formatCurrency(totalAmountNum)}
              </span>
            </div>
          </div>
          
          <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
            <div className="flex flex-col items-center justify-center p-1.5 rounded bg-green-50 hover:bg-green-100 transition-colors">
              <span className="text-[10px] uppercase font-bold text-green-700 tracking-wider">Yes</span>
              <span className="text-sm font-bold text-green-800 number-mono">
                {yesPct}%
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-1.5 rounded bg-blue-50 hover:bg-blue-100 transition-colors">
              <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">No</span>
              <span className="text-sm font-bold text-blue-800 number-mono">
                {noPct}%
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
