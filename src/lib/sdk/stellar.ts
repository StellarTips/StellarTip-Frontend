import { config, STELLAR_NETWORKS } from "@/config/index";
import type { WalletState } from "@/types/index";

interface FreighterApi {
  isConnected: () => Promise<{ isConnected: boolean }>;
  getPublicKey: () => Promise<string>;
  getNetwork: () => Promise<string>;
}

function getFreighterApi(): FreighterApi | undefined {
  if (typeof window === "undefined") return undefined;
  const stellar = (
    window as unknown as {
      stellar?: FreighterApi;
    }
  ).stellar;
  return stellar;
}

function normalizeNetwork(freighterNetwork: string): "testnet" | "mainnet" {
  const upper = freighterNetwork.toUpperCase();
  if (upper.includes("MAINNET") || upper === "PUBLIC") return "mainnet";
  return "testnet";
}

/**
 * Check if the Freighter wallet extension is installed.
 */
export function isFreighterInstalled(): boolean {
  if (typeof window === "undefined") return false;
  return "stellar" in window || "freighter" in window;
}

/**
 * Request wallet connection via Freighter.
 * Returns the connected address and the detected network.
 */
export async function connectWallet(): Promise<{
  address: string;
  publicKey: string;
  network: "testnet" | "mainnet";
}> {
  if (!isFreighterInstalled()) {
    throw new Error(
      "Freighter wallet is not installed. Please install the Freighter browser extension."
    );
  }

  try {
    const stellar = getFreighterApi();

    if (!stellar) {
      throw new Error("Freighter API not available");
    }

    const { isConnected } = await stellar.isConnected();
    if (!isConnected) {
      throw new Error("Freighter is locked. Please unlock your wallet.");
    }

    const publicKey = await stellar.getPublicKey();
    const freighterNetwork = await stellar.getNetwork();
    const network = normalizeNetwork(freighterNetwork);

    return {
      address: publicKey,
      publicKey,
      network,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to connect wallet";
    throw new Error(message);
  }
}

/**
 * Get the current wallet state.
 */
export async function getWalletState(): Promise<WalletState> {
  const installed = isFreighterInstalled();
  const configuredNetwork = config.stellar.network;

  if (!installed) {
    return {
      address: null,
      publicKey: null,
      network: configuredNetwork,
      configuredNetwork,
      status: "disconnected",
      isFreighterInstalled: false,
    };
  }

  try {
    const { publicKey, network } = await connectWallet();
    return {
      address: publicKey,
      publicKey,
      network,
      configuredNetwork,
      status: "connected",
      isFreighterInstalled: true,
    };
  } catch {
    return {
      address: null,
      publicKey: null,
      network: configuredNetwork,
      configuredNetwork,
      status: "disconnected",
      isFreighterInstalled: true,
    };
  }
}

/**
 * Get the network passphrase for the configured Stellar network.
 */
export function getNetworkPassphrase(network: "testnet" | "mainnet"): string {
  return STELLAR_NETWORKS[network].passphrase;
}
