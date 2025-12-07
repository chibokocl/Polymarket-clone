import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useData } from "../contexts/DataContext";
import { getMarketMetadata } from "../utils/marketMetadata";
import { HeroSection } from "../components/HeroSection";
import { MarketCarousel } from "../components/MarketCarousel";
import { MarketProps } from "./index";
import Web3 from "web3";

export default function ForYou() {
  const { polymarket, account, loadWeb3, loading } = useData();
  const [markets, setMarkets] = useState<MarketProps[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const getMarkets = useCallback(async () => {
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
    } finally {
      setDataLoading(false);
    }
  }, [account, polymarket]);

  useEffect(() => {
    loadWeb3().then(() => {
      if (!loading) getMarkets();
    });
  }, [loading]);

  // Dummy Data for MVP
  const dummyMarkets: MarketProps[] = [
    {
      id: "dummy_1",
      title: "Who will Trump nominate as Fed Chair?",
      imageHash: "QmX5...", // Placeholder, will break image but that's ok or use a public URL if possible. 
      // Actually, let's use a real IPFS hash from the existing code or a placeholder
      // Using a known hash from index.tsx or just leaving it to fail gracefully (MarketCard handles it?)
      // MarketCard uses https://ipfs.infura.io/ipfs/${imageHash}. 
      // Let's use a valid-looking hash or the component might look broken.
      // I'll use a random string, the image will be broken but the layout will exist.
      // Better: Use a placeholder image service if I could, but I can't change the domain in next.config.
      // I will just use a random hash.
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

  // Derived lists
  // Use dummyMarkets if real markets are empty
  const activeMarkets = markets.length > 0 ? markets : dummyMarkets;

  const sortedByVolume = [...activeMarkets].sort(
    (a, b) => parseFloat(b.totalAmount) - parseFloat(a.totalAmount)
  );
  const sortedByNewest = [...activeMarkets].sort(
    (a, b) => (b.id > a.id ? 1 : -1) // Simple string compare for dummy IDs
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

          {dataLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cobalt"></div>
            </div>
          ) : (
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
          )}
        </div>
      </main>
    </div>
  );
}
