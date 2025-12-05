import Head from "next/head";
import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useData } from "../contexts/DataContext";
import { getMarketMetadata } from "../utils/marketMetadata";
import { HeroSection } from "../components/HeroSection";
import { MarketCarousel } from "../components/MarketCarousel";
import { MarketProps } from "./index";

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

  // Derived lists
  const sortedByVolume = [...markets].sort(
    (a, b) => parseFloat(b.totalAmount) - parseFloat(a.totalAmount)
  );
  const sortedByNewest = [...markets].sort(
    (a, b) => parseInt(b.id) - parseInt(a.id)
  );
  
  const cryptoMarkets = markets.filter(m => m.category === "Crypto");
  const politicsMarkets = markets.filter(m => m.category === "Politics");
  const sportsMarkets = markets.filter(m => m.category === "Sports");

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
