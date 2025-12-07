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
// Dummy Data for MVP (Moved outside component)
const dummyMarkets: MarketProps[] = [
  // Politics
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
    id: "dummy_5",
    title: "Will the US government shut down in 2024?",
    imageHash: "QmP...",
    totalAmount: Web3.utils.toWei("2100000", "ether"),
    totalYes: Web3.utils.toWei("840000", "ether"), // 40%
    totalNo: Web3.utils.toWei("1260000", "ether"),
    category: "Politics",
    tags: ["US", "Congress"],
  },
  {
    id: "dummy_6",
    title: "Next UK Prime Minister after Sunak?",
    imageHash: "QmU...",
    totalAmount: Web3.utils.toWei("1500000", "ether"),
    totalYes: Web3.utils.toWei("900000", "ether"), // 60%
    totalNo: Web3.utils.toWei("600000", "ether"),
    category: "Politics",
    tags: ["UK", "Election"],
  },

  // Crypto
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
    id: "dummy_7",
    title: "Ethereum ETF approval in May?",
    imageHash: "QmE...",
    totalAmount: Web3.utils.toWei("8900000", "ether"),
    totalYes: Web3.utils.toWei("7120000", "ether"), // 80%
    totalNo: Web3.utils.toWei("1780000", "ether"),
    category: "Crypto",
    tags: ["Ethereum", "ETF", "SEC"],
  },
  {
    id: "dummy_8",
    title: "Solana to flip BNB market cap in 2024?",
    imageHash: "QmS...",
    totalAmount: Web3.utils.toWei("4500000", "ether"),
    totalYes: Web3.utils.toWei("1350000", "ether"), // 30%
    totalNo: Web3.utils.toWei("3150000", "ether"),
    category: "Crypto",
    tags: ["Solana", "BNB"],
  },

  // Sports
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
    id: "dummy_9",
    title: "NBA Finals 2024: Celtics to win?",
    imageHash: "QmN...",
    totalAmount: Web3.utils.toWei("2800000", "ether"),
    totalYes: Web3.utils.toWei("2100000", "ether"), // 75%
    totalNo: Web3.utils.toWei("700000", "ether"),
    category: "Sports",
    tags: ["NBA", "Celtics"],
  },
  {
    id: "dummy_10",
    title: "Will LeBron James retire in 2024?",
    imageHash: "QmL...",
    totalAmount: Web3.utils.toWei("1200000", "ether"),
    totalYes: Web3.utils.toWei("120000", "ether"), // 10%
    totalNo: Web3.utils.toWei("1080000", "ether"),
    category: "Sports",
    tags: ["NBA", "LeBron"],
  },

  // Science & Tech
  {
    id: "dummy_4",
    title: "Will SpaceX Starship reach orbit in next launch?",
    imageHash: "QmA...",
    totalAmount: Web3.utils.toWei("950000", "ether"),
    totalYes: Web3.utils.toWei("855000", "ether"), // 90%
    totalNo: Web3.utils.toWei("95000", "ether"),
    category: "Science",
    tags: ["SpaceX", "Mars"],
  },
  {
    id: "dummy_11",
    title: "GPT-5 release before Q3 2024?",
    imageHash: "QmG...",
    totalAmount: Web3.utils.toWei("6700000", "ether"),
    totalYes: Web3.utils.toWei("2010000", "ether"), // 30%
    totalNo: Web3.utils.toWei("4690000", "ether"),
    category: "Science",
    tags: ["AI", "OpenAI"],
  },
  {
    id: "dummy_12",
    title: "Apple Vision Pro 2 announced in 2025?",
    imageHash: "QmV...",
    totalAmount: Web3.utils.toWei("1800000", "ether"),
    totalYes: Web3.utils.toWei("1080000", "ether"), // 60%
    totalNo: Web3.utils.toWei("720000", "ether"),
    category: "Science",
    tags: ["Apple", "VR"],
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
    loadWeb3();
  }, []);

  useEffect(() => {
    if (!loading && polymarket) {
      getMarkets();
    }
  }, [loading, polymarket]);

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
