"use client"

import React, { useState } from "react";
import { useTradeOperations } from "../../hooks/trades.hooks";
import { useAccount } from 'wagmi';
import toast from "react-hot-toast";

type Trade = string;

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

  const { address, isConnected } = useAccount();
  const user = address ?? "";

  // Get trades
  const { data: trades, isLoading: tradesLoading } = useGetUserTrades(user);

  const handleExecuteTrade = () => {
    let randomId = Date.now();
    randomId = (randomId%1000000);
    setTradeId(randomId.toString());
    if (!token || !amount || !price) {
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
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side - Trade Execution Form */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Execute Trade</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Token Address:</label>
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

              <div>
                <label className="block text-sm font-medium mb-1">Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price:</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600"
                />
              </div>

              <button
                onClick={handleExecuteTrade}
                disabled={isSending || confirming}
                className={`w-full p-2 rounded-md ${
                  isSending || confirming
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSending ? "Executing..." : "Execute Trade"}
              </button>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-1">Attestation Details:</label>
                <textarea
                  value={attestationDetails}
                  onChange={(e) => setAttestationDetails(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-700 border border-gray-600"
                  rows={4}
                />
              </div>

              <button
                onClick={handleRecordAttestation}
                disabled={isAttesting || confirming}
                className={`w-full p-2 rounded-md ${
                  isAttesting || confirming
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isAttesting ? "Recording..." : "Record Attestation"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Trade History */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Trade History</h2>
            
            {!isConnected ? (
              <div className="text-center py-8">
                Please connect your wallet to view trades
              </div>
            ) : tradesLoading ? (
              <div className="text-center py-8">Loading trades...</div>
            ) : trades && Array.isArray(trades) && trades.length > 0 ? (
              <div className="space-y-4">
                  {trades.map((trade: Trade) => (
                <div>
                  {trade}
                </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No trades found
              </div>
            )}
          </div>
        </div>
      </div>

      {confirming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-lg">Confirming transaction...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeSelector;