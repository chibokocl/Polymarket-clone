import moment from "moment";
import Img from "next/image";
import React from "react";
import Web3 from "web3";

export interface MarketProps {
  id: string;
  title: string;
  imageHash: string;
  totalAmount: string;
  totalYes: string;
  totalNo: string;
  userYes: string;
  userNo: string;
  hasResolved?: boolean;
  timestamp: string;
  endTimestamp: string;
}

export const PortfolioMarketCard: React.FC<MarketProps> = ({
  title,
  userYes,
  userNo,
  id,
  imageHash,
  totalYes,
  totalNo,
  totalAmount,
  hasResolved,
  timestamp,
  endTimestamp,
}) => {
  var endingOn = moment(parseInt(endTimestamp));
  var now = moment(new Date()); //todays date
  var daysLeft = moment.duration(endingOn.diff(now)).asDays().toFixed(0);
  return (
    <div className="w-full overflow-hidden my-2">
      <div className="flex flex-col card-animate border border-cobalt-soft rounded-2xl p-5 cursor-pointer bg-white/90 backdrop-blur-sm shadow-sm">
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
            <span className="text-sm text-gray-500 font-light">Outcome</span>
            <span className="text-base font-semibold text-cobalt">
              {userYes ? "YES" : "NO"}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-light">
              Amount Added
            </span>
            <span className="text-base number-mono text-gray-900">
              {Web3.utils.fromWei(userYes ?? userNo)} POLY
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-light">Added On</span>
            <span className="text-base">
              {timestamp
                ? moment(parseInt(timestamp) * 1000).format(
                    "MMMM D, YYYY HH:mm a"
                  )
                : "N/A"}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500 font-light">Ending In</span>
            <span className="text-base number-mono text-gray-900">
              {parseInt(daysLeft) > 0 ? `${daysLeft} days` : "Ended"}
            </span>
          </div>
          <div className="flex flex-col space-y-1 items-end">
            <div className="py-2 px-8 rounded-full cta-primary text-white text-sm font-semibold shadow-brand-card">
              Trade
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
