import Img from "next/image";
import Link from "next/link";
import React from "react";
import Web3 from "web3";
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
  return (
    <div className="w-full overflow-hidden my-2">
      <Link href={`/market/${id}`} passHref>
        <div className="flex flex-col h-full card-animate border border-cobalt-soft bg-white/80 rounded-2xl p-4 cursor-pointer backdrop-blur-sm hover:border-cobalt-light shadow-sm">
          <div className="flex flex-row space-x-4 pb-4 items-center">
            <div className="w-12 h-w-12 rounded-full bg-cyanbrand-soft flex items-center justify-center overflow-hidden">
              <Img
                src={`https://ipfs.infura.io/ipfs/${imageHash}`}
                className="rounded-full"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                    CATEGORY_COLORS[category] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {category}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900 leading-snug line-clamp-3">
                {title}
              </span>
            </div>
          </div>
          <div className="flex flex-row flex-nowrap justify-between items-center mt-auto">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light uppercase tracking-wide">
                Volume
              </span>
              <span className="text-sm number-mono text-gray-900">
                {parseFloat(Web3.utils.fromWei(totalAmount, "ether")).toFixed(
                  2
                )}{" "}
                POLY
              </span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light uppercase tracking-wide">
                Yes
              </span>
              <div className="px-2 py-1 bg-cobalt-soft text-center rounded-full">
                <span className="text-xs font-semibold text-cobalt number-mono">
                  {parseFloat(Web3.utils.fromWei(totalYes, "ether")).toFixed(2)}{" "}
                  POLY
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 font-light uppercase tracking-wide">
                No
              </span>
              <div className="px-2 py-1 bg-cyanbrand-soft text-center rounded-full">
                <span className="text-xs font-semibold text-lapis number-mono">
                  {parseFloat(Web3.utils.fromWei(totalNo, "ether")).toFixed(2)}{" "}
                  POLY
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
