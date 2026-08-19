"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { loadStoredAuth } from "@/lib/auth";
import type { Tip } from "@/types/index";

export default function DashboardTipsPage() {
  const router = useRouter();
  const [tips, setTips] = useState<Tip[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = loadStoredAuth();
    if (!auth) {
      router.push("/login");
      return;
    }

    api.setToken(auth.access_token);

    async function loadTips() {
      try {
        const data = await api.getMyReceivedTips(page, 20);
        setTips(data.data);
        setTotalPages(data.totalPages);
      } catch {
        setError("Failed to load tips");
      } finally {
        setIsLoading(false);
      }
    }

    loadTips();
  }, [page, router]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" width="32px" height="32px" />
                <div>
                  <Skeleton variant="text" width="120px" height="14px" />
                  <Skeleton variant="text" width="80px" height="12px" className="mt-1" />
                </div>
              </div>
              <Skeleton variant="text" width="60px" height="14px" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
        Received Tips
      </h2>

      {tips.length === 0 ? (
        <Card>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            No tips received yet. Share your tip link to start receiving tips!
          </p>
        </Card>
      ) : (
        <>
          {tips.map((tip) => (
            <Card key={tip.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                      {tip.senderWallet
                        ? `${tip.senderWallet.slice(0, 6)}...${tip.senderWallet.slice(-4)}`
                        : "Anonymous"}
                    </p>
                    <p className="text-xs text-surface-500">
                      {new Date(tip.createdAt).toLocaleDateString()}
                      {tip.message && ` — "${tip.message}"`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary-600">
                    +{tip.amount} {tip.asset}
                  </p>
                  <p className="text-xs text-surface-500">{tip.status}</p>
                </div>
              </div>
            </Card>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-surface-500">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
