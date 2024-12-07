"use client"

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAccount } from 'wagmi';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

type ActionType = "ANALYZE_MARKET" | "RECOMMEND_TRADE" | "PORTFOLIO_ANALYSIS";

interface Preferences {
  riskTolerance?: string;
  investmentHorizon?: string;
  tradingStyle?: string;
  [key: string]: any;
}

const MarketAnalysisComponent: React.FC = () => {
  const { address } = useAccount();
  console.log("account: ", address);
  const [action, setAction] = useState<ActionType>("ANALYZE_MARKET");
  const [token, setToken] = useState("");
  const [preferences, setPreferences] = useState<Preferences>({
    "riskTolerance": "moderate",
    "investmentHorizon": "medium",
    "tradingStyle": "swing"
  });
  const [response, setResponse] = useState(" ");
  const [loading, setLoading] = useState(false);

  const generatePrompt = (action: ActionType, token: string, preferences: Preferences): string => {
    switch (action) {
      case "ANALYZE_MARKET":
        return `You are an expert crypto market analyst. Analyze the current market conditions for ${token}. Consider:
          1. Recent price movements
          2. Volume trends
          3. Market sentiment
          4. Technical indicators
          
          Provide a detailed analysis with specific insights and data points.`;

      case "RECOMMEND_TRADE":
        return `You are an expert crypto trading advisor. Based on current market conditions and these user preferences (${JSON.stringify(preferences)}), recommend a trade for ${token} with:
          1. Trade direction (buy/sell)
          2. Token pair
          3. Suggested entry price range
          4. Target price
          5. Stop loss
          
          Explain your reasoning for each recommendation and include risk warnings.`;

      case "PORTFOLIO_ANALYSIS":
        return `You are an expert crypto portfolio analyst. For the wallet address ${address}, analyze:
          1. Asset distribution
          2. Performance metrics
          3. Risk assessment
          4. Rebalancing recommendations
          
          Provide specific recommendations for portfolio optimization.`;

      default:
        throw new Error("Invalid action selected");
    }
  };

  const fetchCoinbasePrice = async (token: string) => {
    try {
      const response = await fetch(`https://api.coinbase.com/v2/prices/${token}-USD/spot`);
      const data = await response.json();
      return data.data.amount;
    } catch (error) {
      console.error("Error fetching price from Coinbase:", error);
      return null;
    }
  };

  const handleGo = async () => {
    try {
      setLoading(true);
      setResponse("");

      if (action === "ANALYZE_MARKET" && !token) {
        toast.error("Please provide a token to analyze.");
        return;
      }

      // Fetch current price from Coinbase if analyzing market or recommending trade
      let currentPrice = null;
      if (["ANALYZE_MARKET", "RECOMMEND_TRADE"].includes(action)) {
        currentPrice = await fetchCoinbasePrice(token);
      }

      const prompt = generatePrompt(action, token, preferences);
      const additionalContext = currentPrice ? `\nCurrent ${token} price: $${currentPrice}` : "";

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a professional crypto market analyst with extensive experience in technical and fundamental analysis."
          },
          {
            role: "user",
            content: prompt + additionalContext
          }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.7,
      });

      setResponse(completion.choices[0].message.content || "No response generated");

    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate analysis");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesChange = (value: string) => {
    try {
      const parsedValue = value ? JSON.parse(value) : {};
      setPreferences(parsedValue);
    } catch (error) {
      console.error("Invalid JSON:", error);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Market Analysis</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Action:</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value as ActionType)}
          className="w-full p-2 border rounded-md text-black"
        >
          <option value="ANALYZE_MARKET">Analyze Market</option>
          <option value="RECOMMEND_TRADE">Recommend Trade</option>
          <option value="PORTFOLIO_ANALYSIS">Portfolio Analysis</option>
        </select>
      </div>

      {action === "ANALYZE_MARKET" && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Token:</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
            placeholder="Enter token (e.g., ETH)"
            className="w-full p-2 border rounded-md text-black"
          />
        </div>
      )}

      {action === "RECOMMEND_TRADE" && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Trading Preferences:</label>
          <textarea
            value={JSON.stringify(preferences, null, 2)}
            onChange={(e) => handlePreferencesChange(e.target.value)}
            placeholder='{
  "riskTolerance": "moderate",
  "investmentHorizon": "medium",
  "tradingStyle": "swing"
}'
            className="w-full p-2 border rounded-md font-mono text-sm text-black"
            rows={5}
          />
        </div>
      )}

      <button
        onClick={handleGo}
        disabled={loading}
        className={`w-full p-2 rounded-md ${
          loading 
            ? "bg-gray-300 cursor-not-allowed" 
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {response && (
        <div className="mt-4 p-4 border rounded-md">
          <h3 className="text-lg font-medium mb-2">Analysis:</h3>
          <div className="whitespace-pre-wrap font-mono text-sm">{response}</div>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysisComponent;