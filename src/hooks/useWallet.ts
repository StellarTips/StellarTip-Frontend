"use client";

import { useCallback, useEffect, useState } from "react";
import { connectWallet, isFreighterInstalled } from "@/lib/sdk/stellar";
import { config } from "@/config/index";
import type { WalletConnectionStatus, WalletState } from "@/types/index";

const initialState: WalletState = {
  address: null,
  publicKey: null,
  network: config.stellar.network,
  configuredNetwork: config.stellar.network,
  status: "disconnected",
  isFreighterInstalled: false,
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const installed = isFreighterInstalled();
    setWallet((prev) => ({ ...prev, isFreighterInstalled: installed }));
  }, []);

  const connect = useCallback(async () => {
    if (!isFreighterInstalled()) {
      setWallet((prev) => ({
        ...prev,
        status: "error" as WalletConnectionStatus,
      }));
      return;
    }

    setIsLoading(true);
    setWallet((prev) => ({
      ...prev,
      status: "connecting" as WalletConnectionStatus,
    }));

    try {
      const { address, publicKey, network } = await connectWallet();
      setWallet({
        address,
        publicKey,
        network,
        configuredNetwork: config.stellar.network,
        status: "connected",
        isFreighterInstalled: true,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Connection failed";
      setWallet((prev) => ({
        ...prev,
        status: "error" as WalletConnectionStatus,
      }));
      console.error("Wallet connection error:", message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet(initialState);
  }, []);

  return {
    wallet,
    isLoading,
    connect,
    disconnect,
  };
}
