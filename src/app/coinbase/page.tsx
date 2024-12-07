'use client';

import { useState } from 'react';
import { MarketAnalysis } from '../../types/agent';
import { TradingAgent } from '../../services/tradingAgent';
import { TRADING_AGENT_CONFIG } from '../../configs/coinbase-agent.config'

export default function TradingPage() {
    const [analysis, setAnalysis] = useState<MarketAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyzeMarket = async (cryptocurrency: string) => {
        setLoading(true);
        setError(null);

        const tradingAgent = new TradingAgent(TRADING_AGENT_CONFIG);
        const analysis = await tradingAgent.analyzeMarket(cryptocurrency);
        setAnalysis(analysis)
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Cryptocurrency Market Analysis</h1>
            
            <div className="flex space-x-2 mb-4">
                <button 
                    onClick={() => handleAnalyzeMarket('BTC-USD')}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    Analyze Bitcoin
                </button>
                <button 
                    onClick={() => handleAnalyzeMarket('ETH-USD')}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    Analyze Ethereum
                </button>
            </div>

            {loading && <p>Loading market analysis...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {analysis && (
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="text-xl font-semibold">Market Analysis</h2>
                    <p>Current Price: {analysis.price}</p>
                    <p>AI Insights: {analysis.aiInsights}</p>
                </div>
            )}
        </div>
    );
}