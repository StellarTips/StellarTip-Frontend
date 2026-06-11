"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { useWallet } from "@/hooks/useWallet";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TipPage() {
  const params = useParams();
  const username = params.username as string;
  const { wallet } = useWallet();
  const { addToast } = useToast();
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("XLM");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: submit tip
    addToast(`Tipping ${amount} ${currency} to @${username}`, "success");
  };

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-lg">
        <Link
          href={`/u/${username}`}
          className="mb-6 inline-flex items-center text-sm text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to profile
        </Link>

        <Card>
          <div className="mb-6 flex items-center gap-4">
            <Avatar size="lg" fallback={username} />
            <div>
              <h1 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                Send a tip to @{username}
              </h1>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Support this creator on the Stellar network
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                type="number"
                label="Amount"
                placeholder="10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.1"
                step="0.1"
              />
              <Select
                label="Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={[
                  { value: "XLM", label: "XLM" },
                  { value: "USDC", label: "USDC" },
                ]}
              />
            </div>
            <Textarea
              label="Message (optional)"
              placeholder="Thank you for the amazing content!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />

            {wallet.status === "connected" ? (
              <Button type="submit" className="w-full">
                <Heart className="mr-1.5 h-4 w-4" />
                Send tip
              </Button>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-900/20">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Connect your wallet to send a tip.
                </p>
                <div className="mt-3">
                  <ConnectWalletButton />
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
}
