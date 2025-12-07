import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useData } from "../contexts/DataContext";
import { getMarketMetadata } from "../utils/marketMetadata";
import { HeroSection } from "../components/HeroSection";
import { MarketCarousel } from "../components/MarketCarousel";
import { MarketProps } from "./index";
import Web3 from "web3";

// Dummy Data for MVP (Moved outside component)
const dummyMarkets: MarketProps[] = [
  {
    id: "dummy_1",
    title: "Who will Trump nominate as Fed Chair?",
    imageHash: "QmX5...", 
    totalAmount: Web3.utils.toWei("5868270", "ether"),
    totalYes: Web3.utils.toWei("1173654", "ether"), // ~20%
    totalNo: Web3.utils.toWei("4694616", "ether"),
    category: "Politics",
    tags: ["Fed", "Trump", "Economy"],
  },
  {
    id: "dummy_2",
    title: "Will Bitcoin hit $100k in 2024?",
    imageHash: "QmY...", 
    totalAmount: Web3.utils.toWei("12500000", "ether"),
    totalYes: Web3.utils.toWei("8125000", "ether"), // 65%
    totalNo: Web3.utils.toWei("4375000", "ether"),
    category: "Crypto",
    tags: ["Bitcoin", "Price"],
  },
  {
    id: "dummy_3",
    title: "Super Bowl LIX Winner: Chiefs vs Eagles?",
    imageHash: "QmZ...",
    totalAmount: Web3.utils.toWei("3200000", "ether"),
    totalYes: Web3.utils.toWei("1600000", "ether"), // 50%
    totalNo: Web3.utils.toWei("1600000", "ether"),
    category: "Sports",
    tags: ["NFL", "Super Bowl"],
  },
  {
    id: "dummy_4",
    title: "Will SpaceX Starship reach orbit in next launch?",
    imageHash: "QmA...",
    totalAmount: Web3.utils.toWei("950000", "ether"),
    totalYes: Web3.utils.toWei("855000", "ether"), // 90%
    totalNo: Web3.utils.toWei("95000", "ether"),
    category: "Science",
    tags: ["SpaceX", "Mars"],
  }
];

export default function ForYou() {
  const { polymarket, account, loadWeb3, loading } = useData();
  const [markets, setMarkets] = useState<MarketProps[]>([]);
  // Removed blocking dataLoading state

  const getMarkets = useCallback(async () => {
    if (!polymarket) return;
    try {
      var totalQuestions = await polymarket.methods
        .totalQuestions()
        .call({ from: account });
      var dataArray: MarketProps[] = [];
      for (var i = 0; i < totalQuestions; i++) {
        var data = await polymarket.methods.questions(i).call({ from: account });
        const metadata = getMarketMetadata(data.id);
        dataArray.push({
          id: data.id,
          title: data.question,
          imageHash: data.creatorImageHash,
          totalAmount: data.totalAmount,
          totalYes: data.totalYesAmount,
          totalNo: data.totalNoAmount,
          category: metadata.category,
          tags: metadata.tags,
        });
      }
      setMarkets(dataArray);
    } catch (error) {
      console.error("Error fetching markets:", error);
    }
  }, [account, polymarket]);

  useEffect(() => {
    loadWeb3().then(() => {
      // Attempt to fetch markets, but don't block UI
      if (!loading) getMarkets();
    });
  }, [loading]);

  // Derived lists
  // Always show dummy markets if real markets are empty
  const activeMarkets = markets.length > 0 ? markets : dummyMarkets;

  const sortedByVolume = [...activeMarkets].sort(
    (a, b) => parseFloat(b.totalAmount) - parseFloat(a.totalAmount)
  );
  const sortedByNewest = [...activeMarkets].sort(
    (a, b) => (b.id > a.id ? 1 : -1)
  );
  
  const cryptoMarkets = activeMarkets.filter(m => m.category === "Crypto");
  const politicsMarkets = activeMarkets.filter(m => m.category === "Politics");
  const sportsMarkets = activeMarkets.filter(m => m.category === "Sports");

  // Featured market: Highest volume or specific ID
  const featuredMarket = sortedByVolume[0];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>For You | Polymarket</title>
        <meta name="description" content="Personalized market dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      
      <main className="w-full flex flex-col items-center py-4 px-2 sm:px-4 flex-grow">
        <div className="w-full max-w-7xl">
          <div className="mb-8 mt-4 px-2">
            <h1 className="text-3xl font-bold text-gray-900">For You</h1>
            <p className="text-gray-500 mt-1">Markets curated based on your interests and trends.</p>
          </div>

          {/* Render content immediately, no loading spinner blocking */}
          <>
            {featuredMarket && <HeroSection market={featuredMarket} />}

            <MarketCarousel title="Trending Now" markets={sortedByVolume.slice(0, 10)} />
            
            <MarketCarousel title="Newest Markets" markets={sortedByNewest.slice(0, 10)} />

            {cryptoMarkets.length > 0 && (
              <MarketCarousel title="Crypto" markets={cryptoMarkets} />
            )}
            
            {politicsMarkets.length > 0 && (
              <MarketCarousel title="Politics" markets={politicsMarkets} />
            )}
            
            {sportsMarkets.length > 0 && (
                <MarketCarousel title="Sports" markets={sportsMarkets} />
            )}
          </>
        </div>
      </main>
    </div>
  );
}
