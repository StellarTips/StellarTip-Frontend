export const config = {
  app: {
    name: "StellarTip",
    description: "Instant micro-tipping for creators on the Stellar network",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  },

  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api",
    timeout: 10_000,
  },

  stellar: {
    network: (process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet") as "testnet" | "mainnet",
    rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL ?? "https://soroban-testnet.stellar.org",
  },

  pagination: {
    defaultPage: 1,
    defaultLimit: 20,
    maxLimit: 100,
  },
} as const;

export const STELLAR_NETWORKS = {
  testnet: {
    name: "Testnet",
    rpcUrl: "https://soroban-testnet.stellar.org",
    passphrase: "Test SDF Network ; September 2015",
    friendbotUrl: "https://friendbot.stellar.org",
  },
  mainnet: {
    name: "Mainnet",
    rpcUrl: "https://soroban.stellar.org",
    passphrase: "Public Global Stellar Network ; September 2015",
    friendbotUrl: null,
  },
} as const;
