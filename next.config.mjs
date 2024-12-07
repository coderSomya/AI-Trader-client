/** @type {import('next').NextConfig} */

const nextConfig = {
    env: {
      COINBASE_API_KEY: process.env.COINBASE_API_KEY,
      COINBASE_API_SECRET: process.env.COINBASE_API_SECRET,
      COINBASE_API_PASSPHRASE: process.env.COINBASE_API_PASSPHRASE,
      CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
      ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL,
    },
  };
export default nextConfig;
