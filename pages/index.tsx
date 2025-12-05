import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { Filter } from "../components/Filter";
import { MarketCard } from "../components/MarketCard";
import Navbar from "../components/Navbar";
import { useData } from "../contexts/DataContext";
import styles from "../styles/Home.module.css";
import ChartContainer from "../components/Chart/ChartContainer";

export interface MarketProps {
  id: string;
  title: string;
  imageHash: string;
  totalAmount: string;
  totalYes: string;
  totalNo: string;
}

export default function Home() {
  const { polymarket, account, loadWeb3, loading } = useData();
  const [markets, setMarkets] = useState<MarketProps[]>([]);

  type PredictionOption = {
    range: string;
    probability: number;
  };

  type Prediction = {
    id: number;
    title: string;
    location: string;
    category: string;
    options: PredictionOption[];
    volume: number;
    status: "active" | "closed";
    timeLeft?: string;
    traders: number;
  };

  const predictions: Prediction[] = [
    {
      id: 1,
      title: "Highest temperature in LA on Dec 3, 2025?",
      location: "Los Angeles, CA",
      category: "Temperature",
      options: [
        { range: "71° or above", probability: 3 },
        { range: "67° to 68°", probability: 97 },
      ],
      volume: 296925,
      status: "closed",
      traders: 1247,
    },
    {
      id: 2,
      title: "Highest temperature in Denver on Dec 3, 2025?",
      location: "Denver, CO",
      category: "Temperature",
      options: [
        { range: "32° to 33°", probability: 99 },
        { range: "27° or below", probability: 1 },
      ],
      volume: 82669,
      status: "closed",
      traders: 543,
    },
    {
      id: 3,
      title: "Highest temperature in Chicago today?",
      location: "Chicago, IL",
      category: "Temperature",
      options: [
        { range: "18° to 19°", probability: 52 },
        { range: "20° to 21°", probability: 31 },
      ],
      volume: 39608,
      status: "active",
      timeLeft: "18h 1m",
      traders: 892,
    },
    {
      id: 4,
      title: "Highest temperature in NYC today?",
      location: "New York, NY",
      category: "Temperature",
      options: [
        { range: "39° to 40°", probability: 56 },
        { range: "41° to 42°", probability: 33 },
      ],
      volume: 16653,
      status: "active",
      timeLeft: "17h 1m",
      traders: 324,
    },
    {
      id: 5,
      title: "Snow in Philadelphia this month?",
      location: "Philadelphia, PA",
      category: "Snow",
      options: [
        { range: "Above 3.0 inches", probability: 33 },
        { range: "Above 6.0 inches", probability: 14 },
      ],
      volume: 21837,
      status: "active",
      timeLeft: "27 days",
      traders: 456,
    },
    {
      id: 6,
      title: "Highest temperature in Austin today?",
      location: "Austin, TX",
      category: "Temperature",
      options: [
        { range: "54° or below", probability: 65 },
        { range: "55° to 56°", probability: 34 },
      ],
      volume: 16971,
      status: "active",
      timeLeft: "18h 1m",
      traders: 278,
    },
    {
      id: 7,
      title: "Snow in Denver this month?",
      location: "Denver, CO",
      category: "Snow",
      options: [
        { range: "Above 10.0 inches", probability: 27 },
        { range: "Above 5.0 inches", probability: 82 },
      ],
      volume: 37515,
      status: "active",
      timeLeft: "27 days",
      traders: 623,
    },
    {
      id: 8,
      title: "Highest temperature in Miami today?",
      location: "Miami, FL",
      category: "Temperature",
      options: [
        { range: "82° to 83°", probability: 52 },
        { range: "84° to 85°", probability: 27 },
      ],
      volume: 9014,
      status: "active",
      timeLeft: "17h 1m",
      traders: 156,
    },
    {
      id: 9,
      title: "Snow in Seattle this month?",
      location: "Seattle, WA",
      category: "Snow",
      options: [
        { range: "Above 3.0 inches", probability: 46 },
        { range: "Above 6.0 inches", probability: 19 },
      ],
      volume: 20228,
      status: "active",
      timeLeft: "27 days",
      traders: 389,
    },
    {
      id: 10,
      title: "Rain in San Francisco this month?",
      location: "San Francisco, CA",
      category: "Rain",
      options: [
        { range: "Above 2.0 inches", probability: 61 },
        { range: "Above 4.0 inches", probability: 26 },
      ],
      volume: 27936,
      status: "active",
      timeLeft: "27 days",
      traders: 512,
    },
    {
      id: 11,
      title: "Highest temperature in Boston today?",
      location: "Boston, MA",
      category: "Temperature",
      options: [
        { range: "35° to 36°", probability: 48 },
        { range: "37° to 38°", probability: 35 },
      ],
      volume: 12479,
      status: "active",
      timeLeft: "17h 1m",
      traders: 234,
    },
    {
      id: 12,
      title: "Snow in Dallas this month?",
      location: "Dallas, TX",
      category: "Snow",
      options: [
        { range: "Above 1.0 inches", probability: 22 },
        { range: "Above 3.0 inches", probability: 8 },
      ],
      volume: 18650,
      status: "active",
      timeLeft: "27 days",
      traders: 367,
    },
  ];

  const formatVolume = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k POLY`;
    }
    return `${num} POLY`;
  };

  const getMarkets = useCallback(async () => {
    var totalQuestions = await polymarket.methods
      .totalQuestions()
      .call({ from: account });
    var dataArray: MarketProps[] = [];
    for (var i = 0; i < totalQuestions; i++) {
      var data = await polymarket.methods.questions(i).call({ from: account });
      dataArray.push({
        id: data.id,
        title: data.question,
        imageHash: data.creatorImageHash,
        totalAmount: data.totalAmount,
        totalYes: data.totalYesAmount,
        totalNo: data.totalNoAmount,
      });
    }
    setMarkets(dataArray);
  }, [account, polymarket]);

  useEffect(() => {
    loadWeb3().then(() => {
      if (!loading) getMarkets();
    });
  }, [loading]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Polymarket</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="w-full flex flex-col sm:flex-row flex-wrap sm:flex-nowrap py-6 flex-grow max-w-5xl">
        <div className="w-full flex flex-col flex-grow pt-1">
          <div className="relative text-gray-500 focus-within:text-gray-400 w-full mb-2">
            <span className="absolute inset-y-0 left-0 flex items-center px-3">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-5 h-5 text-cobalt"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="search"
              name="q"
              className="w-full py-3 px-3 text-base text-gray-700 bg-white rounded-full pl-10 focus:outline-none shadow-sm focus:ring-2 focus:ring-cyanbrand focus:ring-opacity-80"
              placeholder="Search markets..."
              autoComplete="off"
            />
          </div>
          <div className="flex flex-row space-x-2 md:space-x-5 items-center flex-wrap mt-4">
            <Filter
              list={["All", "Crypto", "Football", "Covid 19", "Politics"]}
              activeItem="All"
              category="Category"
              onChange={() => {}}
            />
            <Filter
              list={["Volume", "Newest", "Expiring"]}
              activeItem="Volume"
              category="Sort By"
              onChange={() => {}}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/90 border border-cobalt-soft px-4 py-3 shadow-sm flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Total Markets
              </span>
              <span className="mt-1 text-xl font-semibold text-gray-900 number-mono">
                {markets.length}
              </span>
            </div>
            <div className="rounded-2xl bg-white/90 border border-cobalt-soft px-4 py-3 shadow-sm flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                24h Volume (demo)
              </span>
              <span className="mt-1 text-xl font-semibold text-gray-900 number-mono">
                12,450 POLY
              </span>
            </div>
            <div className="rounded-2xl bg-white/90 border border-cobalt-soft px-4 py-3 shadow-sm flex flex-col">
              <span className="text-xs uppercase tracking-wide text-gray-500">
                Active Themes
              </span>
              <span className="mt-1 text-sm font-medium text-gray-900">
                Crypto · Macro · Politics
              </span>
            </div>
          </div>
          <span className="font-bold my-3 text-lg text-gray-900">
            Markets
          </span>
          {markets.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictions.map((pred) => (
                <div
                  key={pred.id}
                  className="flex flex-col card-animate border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-1 h-4 rounded bg-cyanbrand" />
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                        {pred.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1">
                      {pred.title}
                    </h3>
                    <div className="text-[11px] text-gray-500">
                      {pred.location}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {pred.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-100 bg-gray-50 rounded-lg p-2.5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">
                            {opt.range}
                          </span>
                          <span className="text-base font-semibold text-cobalt number-mono">
                            {opt.probability}%
                          </span>
                        </div>
                        <div className="flex">
                          <button className="flex-1 h-8 bg-cobalt text-white text-xs font-medium hover:bg-lapis transition-colors">
                            Yes
                          </button>
                          <button className="flex-1 h-8 bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors">
                            No
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="flex space-x-4">
                      <div>
                        <div className="text-[11px] text-gray-500">Volume</div>
                        <div className="text-xs number-mono text-gray-900">
                          {formatVolume(pred.volume)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-500">
                          Traders
                        </div>
                        <div className="text-xs number-mono text-gray-900">
                          {pred.traders}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`h-6 px-2 rounded-full flex items-center space-x-1 text-[11px] ${
                        pred.status === "closed"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-cyanbrand-soft text-lapis"
                      }`}
                    >
                      {pred.status === "active" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyanbrand animate-pulse" />
                      )}
                      <span>
                        {pred.status === "closed" ? "Closed" : pred.timeLeft}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Featured market with chart, similar to Kalshi hero card */}
              <div className="mb-5 rounded-2xl border border-cobalt-soft bg-white shadow-sm overflow-hidden flex flex-col lg:flex-row">
                {(() => {
                  const featured = markets[0];
                  const totalAmountNum = parseFloat(
                    Web3.utils.fromWei(featured.totalAmount || "0", "ether")
                  );
                  const totalYesNum = parseFloat(
                    Web3.utils.fromWei(featured.totalYes || "0", "ether")
                  );
                  const totalNoNum = parseFloat(
                    Web3.utils.fromWei(featured.totalNo || "0", "ether")
                  );
                  const yesPct =
                    totalAmountNum > 0
                      ? ((totalYesNum / totalAmountNum) * 100).toFixed(0)
                      : "0";
                  const noPct =
                    totalAmountNum > 0
                      ? ((totalNoNum / totalAmountNum) * 100).toFixed(0)
                      : "0";

                  return (
                    <>
                      <div className="w-full lg:w-2/5 p-4 md:p-6 flex flex-col justify-between">
                        <div>
                          <span className="text-xs text-gray-500">
                            Featured market
                          </span>
                          <h2 className="mt-1 text-lg font-semibold text-gray-900">
                            {featured.title}
                          </h2>
                          <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                            Trade on the outcome of this event using your POLY
                            balance.
                          </p>
                        </div>
                        <div className="mt-4 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-cobalt text-white px-3 py-2 flex flex-col">
                              <span className="text-[11px] uppercase tracking-wide">
                                Yes
                              </span>
                              <span className="text-lg font-semibold number-mono">
                                {yesPct}%
                              </span>
                            </div>
                            <div className="rounded-lg bg-gray-100 px-3 py-2 flex flex-col">
                              <span className="text-[11px] uppercase tracking-wide text-gray-600">
                                No
                              </span>
                              <span className="text-lg font-semibold text-lapis number-mono">
                                {noPct}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-gray-500">
                            <span>Total volume</span>
                            <span className="number-mono text-gray-900">
                              {totalAmountNum.toFixed(2)} POLY
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full lg:w-3/5 border-t lg:border-t-0 lg:border-l border-cobalt-soft bg-white">
                        <div className="h-64 md:h-72 p-2 md:p-4">
                          <ChartContainer questionId={featured.id} />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Remaining markets grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {markets.slice(1).map((market) => {
                  return (
                    <MarketCard
                      id={market.id}
                      key={market.id}
                      title={market.title}
                      totalAmount={market.totalAmount}
                      totalYes={market.totalYes}
                      totalNo={market.totalNo}
                      imageHash={market.imageHash}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
