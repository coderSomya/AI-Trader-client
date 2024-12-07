import { CoinbaseProClient } from 'coinbase-pro-node';
import Claude from '@anthropic-ai/sdk';
import { ethers } from 'ethers';
import { AgentConfig, MarketAnalysis } from '../types/agent';

export class TradingAgent {
    private coinbaseClient: CoinbaseProClient;
    private claudeClient: Claude;
    private ethereumProvider: ethers.providers.Provider;

    constructor(config: AgentConfig) {
        this.coinbaseClient = new CoinbaseProClient({
            apiKey: process.env.COINBASE_API_KEY!,
            apiSecret: process.env.COINBASE_API_SECRET!,
            apiPassphrase: process.env.COINBASE_API_PASSPHRASE!
        });

        this.claudeClient = new Claude({
            apiKey: process.env.CLAUDE_API_KEY!
        });

        this.ethereumProvider = new ethers.providers.JsonRpcProvider(
            process.env.ETHEREUM_RPC_URL
        );
    }

    async analyzeMarket(cryptocurrency: string): Promise<MarketAnalysis> {
        try {
            // Fetch market data
            const marketData = await this.coinbaseClient.getProductTicker(cryptocurrency);
            
            // Generate AI-powered market analysis
            const analysis = await this.claudeClient.messages.create({
                model: 'claude-3-haiku-20240307',
                max_tokens: 300,
                messages: [
                    {
                        role: 'user',
                        content: `Analyze the current market conditions for ${cryptocurrency}. 
                        Current price: ${marketData.price}
                        Provide trading insights and potential strategies.`
                    }
                ]
            });

            return {
                price: marketData.price,
                aiInsights: analysis.content[0].text
            };
        } catch (error) {
            console.error('Market analysis error:', error);
            throw error;
        }
    }
}