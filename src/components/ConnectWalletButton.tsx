"use client";

import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/ui/Button";
import { Wallet, Loader2 } from "lucide-react";
import { truncateAddress } from "@/lib/utils/format";

export function ConnectWalletButton() {
  const { wallet, isLoading, connect, disconnect } = useWallet();

  if (wallet.status === "connected" && wallet.address) {
    return (
      <Button variant="outline" size="sm" onClick={disconnect}>
        <Wallet className="h-4 w-4 mr-1.5" />
        {truncateAddress(wallet.address)}
      </Button>
    );
  }

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={connect}
      isLoading={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4 mr-1.5" />
      )}
      Connect Wallet
    </Button>
  );
}
