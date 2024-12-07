export interface AgentConfig {
    name: string;
    description: string;
    instructions: string;
    model: string;
    temperature: number;
    tools: string[];
}

export interface MarketAnalysis {
    price: string;
    aiInsights: string;
}