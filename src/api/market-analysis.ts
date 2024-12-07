import type { NextApiRequest, NextApiResponse } from 'next';
import { TradingAgent } from '../../services/tradingAgent';
import { TRADING_AGENT_CONFIG } from '../../config/tradingAgentConfig';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const { cryptocurrency } = req.body;
            
            if (!cryptocurrency) {
                return res.status(400).json({ error: 'Cryptocurrency is required' });
            }

            const tradingAgent = new TradingAgent(TRADING_AGENT_CONFIG);
            const analysis = await tradingAgent.analyzeMarket(cryptocurrency);

            res.status(200).json(analysis);
        } catch (error) {
            console.error('Market analysis error:', error);
            res.status(500).json({ error: 'Failed to analyze market' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}