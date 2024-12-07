"use client"


import React, { useState } from "react";
import { TRADING_AGENT_CONFIG } from "../../configs/coinbase-agent.config";
import { coinbaseAgent } from "@coinbase/agentkit";
import toast from "react-hot-toast";
import { TradingAgent } from "@/services/tradingAgent";

const MarketAnalysisComponent: React.FC = () => {
  const [action, setAction] = useState("ANALYZE_MARKET");
  const [token, setToken] = useState("");
  const [preferences, setPreferences] = useState({});
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const agent = coinbaseAgent.create(TRADING_AGENT_CONFIG);

  const handleGo = async () => {
    setLoading(true);
    setResponse("");

    let prompt = "";
    switch (action) {
      case "ANALYZE_MARKET":
        if (!token) {
          toast.error("Please provide a token to analyze.");
          setLoading(false);
          return;
        }
        prompt = `Analyze the current market conditions for ${token}. Consider:\n  1. Recent price movements\n  2. Volume trends\n  3. Market sentiment\n  4. Technical indicators`;
        break;

      case "RECOMMEND_TRADE":
        prompt = `Based on the market analysis and user preferences, recommend a trade with:\n  1. Trade direction (buy/sell)\n  2. Token pair\n  3. Amount\n  4. Target price\n  5. Stop loss\n  Explain your reasoning for each recommendation.`;
        break;

      case "PORTFOLIO_ANALYSIS":
        prompt = `Analyze the current portfolio across chains:\n  1. Asset distribution\n  2. Performance metrics\n  3. Risk assessment\n  4. Rebalancing recommendations`;
        break;

      default:
        toast.error("Invalid action selected.");
        setLoading(false);
        return;
    }

    try {
      const agentResponse = await agent.query({ prompt });
      setResponse(agentResponse);
    } catch (error) {
      toast.error("Failed to fetch response from the agent.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Market Analysis</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Action:</label>
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          style={{ width: "100%", padding: "0.5rem" }}
        >
          <option value="ANALYZE_MARKET">Analyze Market</option>
          <option value="RECOMMEND_TRADE">Recommend Trade</option>
          <option value="PORTFOLIO_ANALYSIS">Portfolio Analysis</option>
        </select>
      </div>

      {action === "ANALYZE_MARKET" && (
        <div style={{ marginBottom: "1rem" }}>
          <label>Token:</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter token (e.g., ETH)"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
      )}

      {action === "RECOMMEND_TRADE" && (
        <div style={{ marginBottom: "1rem" }}>
          <label>User Preferences:</label>
          <textarea
            value={JSON.stringify(preferences, null, 2)}
            onChange={(e) => setPreferences(JSON.parse(e.target.value || "{}"))}
            placeholder="Enter preferences as JSON"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>
      )}

      <button
        onClick={handleGo}
        disabled={loading}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      >
        {loading ? "Processing..." : "GO"}
      </button>

      {response && (
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Response:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysisComponent;
