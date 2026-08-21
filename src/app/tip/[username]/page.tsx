"use client";

import { useState, useCallback } from "react";
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
import { api, ApiClientError } from "@/lib/api";
import { MIN_AMOUNT, validateAmount, validateMessage } from "@/lib/validation";
import { Heart, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import type { TipAsset, TipStatus } from "@/types/index";

type SubmitStatus = "idle" | "resolving" | "submitting" | "confirmed" | "failed";

interface TipResult {
  id: string;
  transactionHash: string;
  status: TipStatus;
}

export default function TipPage() {
  const params = useParams();
  const username = params.username as string;
  const { wallet } = useWallet();
  const { addToast } = useToast();
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState<TipAsset>("XLM");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [result, setResult] = useState<TipResult | null>(null);
  const [errors, setErrors] = useState<{ amount?: string; message?: string }>({});

  const isSubmitting = status === "resolving" || status === "submitting";

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const amountError = validateAmount(amount);
      const messageError = validateMessage(message);
      if (amountError || messageError) {
        setErrors({ amount: amountError ?? undefined, message: messageError ?? undefined });
        return;
      }
      setErrors({});

      setStatus("resolving");
      try {
        const tippingInfo = await api.getTippingInfo(username);

        setStatus("submitting");
        const tipResult = await api.createTip({
          receiverWallet: tippingInfo.walletAddress,
          senderWallet: wallet.address ?? undefined,
          amount: Number(amount),
          asset,
          message: message || undefined,
        });

        setResult(tipResult);
        setStatus("confirmed");
        addToast("Tip sent successfully!", "success");
      } catch (err) {
        setStatus("failed");
        const msg = err instanceof ApiClientError ? err.message : "Failed to send tip";
        addToast(msg, "error");
      }
    },
    [amount, asset, message, username, wallet.address, addToast]
  );

  if (status === "confirmed" && result) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-lg">
          <Card>
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
                Tip sent!
              </h1>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                {amount} {asset} to @{username}
              </p>
              <div className="rounded-lg bg-surface-50 p-3 dark:bg-surface-800">
                <p className="text-xs text-surface-500 dark:text-surface-400">Status</p>
                <p className="font-medium text-surface-900 dark:text-surface-100">
                  {result.status}
                </p>
              </div>
              {result.transactionHash && (
                <div className="rounded-lg bg-surface-50 p-3 dark:bg-surface-800">
                  <p className="text-xs text-surface-500 dark:text-surface-400">Transaction</p>
                  <p className="font-mono text-xs text-surface-900 dark:text-surface-100">
                    {result.transactionHash}
                  </p>
                </div>
              )}
              <Link
                href={`/u/${username}`}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
              >
                Back to profile
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                }}
                required
                min={String(MIN_AMOUNT)}
                step="0.1"
                error={errors.amount}
                disabled={isSubmitting}
              />
              <Select
                label="Asset"
                value={asset}
                onChange={(e) => setAsset(e.target.value as TipAsset)}
                options={[
                  { value: "XLM", label: "XLM" },
                  { value: "USDC", label: "USDC" },
                ]}
                disabled={isSubmitting}
              />
            </div>
            <Textarea
              label="Message (optional)"
              placeholder="Thank you for the amazing content!"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
              }}
              rows={3}
              error={errors.message}
              disabled={isSubmitting}
            />

            {wallet.status === "connected" ? (
              <>
                {status === "failed" && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-900/20">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Failed to send tip. Please try again.
                    </p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <Heart className="mr-1.5 h-4 w-4" />
                  {status === "resolving" ? "Resolving..." : "Send tip"}
                </Button>
              </>
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
