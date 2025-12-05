export interface MarketMetadata {
    category: string;
    tags: string[];
    description: string;
    resolverUrl?: string;
}

export const defaultMetadata: MarketMetadata = {
    category: "General",
    tags: ["Market"],
    description: "This is a prediction market on the Polymarket clone platform.",
};

export const marketMetadata: Record<string, MarketMetadata> = {
    // Example mappings for potential IDs (0-10)
    "0": {
        category: "Crypto",
        tags: ["ETH", "Price", "2025"],
        description: "Will Ethereum surpass $10,000 by the end of 2025? This market resolves to YES if the price of Ethereum is strictly greater than $10,000 at 11:59 PM UTC on Dec 31, 2025.",
    },
    "1": {
        category: "Politics",
        tags: ["US Election", "2024"],
        description: "Who will win the 2024 US Presidential Election? This market covers all major candidates.",
    },
    "2": {
        category: "Sports",
        tags: ["Super Bowl", "NFL"],
        description: "Who will win Super Bowl LIX? Market resolves based on the official NFL result.",
    },
    "3": {
        category: "Science",
        tags: ["SpaceX", "Mars"],
        description: "Will SpaceX land humans on Mars by 2030? Resolves YES if a human sets foot on the Martian surface.",
    },
    // Mappings for the hardcoded "predictions" in index.tsx (using their IDs as strings)
    "1_static": {
        category: "Weather",
        tags: ["LA", "Temperature"],
        description: "Highest temperature in Los Angeles on Dec 3, 2025.",
    },
    "2_static": {
        category: "Weather",
        tags: ["Denver", "Temperature"],
        description: "Highest temperature in Denver on Dec 3, 2025.",
    },
};

export const getMarketMetadata = (id: string): MarketMetadata => {
    return marketMetadata[id] || defaultMetadata;
};

export const CATEGORY_COLORS: Record<string, string> = {
    Crypto: "bg-blue-100 text-blue-800",
    Politics: "bg-red-100 text-red-800",
    Sports: "bg-green-100 text-green-800",
    Science: "bg-purple-100 text-purple-800",
    Weather: "bg-yellow-100 text-yellow-800",
    General: "bg-gray-100 text-gray-800",
};
