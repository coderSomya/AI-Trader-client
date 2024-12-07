"use client"

import React, { useState } from "react";
import { useTradeOperations } from "../../hooks/trades.hooks";
import toast from "react-hot-toast";

const TradeSelector: React.FC = () => {
  const {
    executeTrade,
    recordAttestation,
    useGetUserTrades,
    isSending,
    isAttesting,
    confirming,
  } = useTradeOperations();

  const [token, setToken] = useState("");
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [tradeId, setTradeId] = useState("");
  const [attestationDetails, setAttestationDetails] = useState("");

  const user = "exampleUserAddress"; // Replace with actual user address

  const handleExecuteTrade = () => {
    if (!token || !amount || !price || !tradeId) {
      toast.error("Please fill all trade details.");
      return;
    }

    executeTrade({ user, token, amount, price, tradeId });
  };

  const handleRecordAttestation = () => {
    if (!tradeId || !attestationDetails) {
      toast.error("Please provide attestation details.");
      return;
    }

    recordAttestation({ user, tradeId, details: attestationDetails });
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Trade Operations</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>Token:</label>
        <select
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ width: "100%", padding: "0.5rem",color: "black" }}
        >
          <option value="">Select a token</option>
          <option value="ETH">ETH</option>
          <option value="BTC">BTC</option>
          <option value="USDT">USDT</option>
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ width: "100%", padding: "0.5rem", color: "black" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          style={{ width: "100%", padding: "0.5rem", color: "black" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Trade ID:</label>
        <input
          type="text"
          value={tradeId}
          onChange={(e) => setTradeId(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", color: "black" }}
        />
      </div>

      <button
        onClick={handleExecuteTrade}
        disabled={isSending || confirming}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      >
        {isSending ? "Sending..." : "Execute Trade"}
      </button>

      <div style={{ marginBottom: "1rem" }}>
        <label>Attestation Details:</label>
        <textarea
          value={attestationDetails}
          onChange={(e) => setAttestationDetails(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", color: "black" }}
        />
      </div>

      <button
        onClick={handleRecordAttestation}
        disabled={isAttesting || confirming}
        style={{ width: "100%", padding: "0.5rem" }}
      >
        {isAttesting ? "Recording..." : "Record Attestation"}
      </button>

      {confirming && <p>Waiting for confirmation...</p>}
    </div>
  );
};

export default TradeSelector;
