
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
          <div className="flex flex-row space-x-3 pb-3 items-start">
            <div className="w-10 h-10 min-w-[40px] rounded-md bg-gray-100 overflow-hidden relative">
              <img
                src={`https://ipfs.infura.io/ipfs/${imageHash}`}
                className="w-full h-full object-cover"
                alt={title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/40";
                }}
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                {title}
              </span>

              <span className="text-[10px] text-gray-400 mt-1 whitespace-nowrap">
                Vol: {formatCurrency(totalAmountNum)}
              </span>
            </div>
          </div>
          
          <div className="mt-auto grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-50 border border-green-100 hover:bg-green-100 transition-all group">
              <span className="text-[10px] uppercase font-bold text-green-600 tracking-wider mb-0.5">Yes</span>
              <span className="text-base font-bold text-green-700 number-mono group-hover:scale-105 transition-transform">
                {yesPct}%
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all group">
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider mb-0.5">No</span>
              <span className="text-base font-bold text-blue-700 number-mono group-hover:scale-105 transition-transform">
                {noPct}%
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
