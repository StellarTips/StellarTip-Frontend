"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { api } from "@/lib/api";
import { loadStoredAuth } from "@/lib/auth";
import type { Tip } from "@/types/index";

interface Analytics {
  totalEarnings?: number;
  tipsReceived?: number;
  averageTip?: number;
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <p className="text-sm text-surface-500 dark:text-surface-400">{title}</p>
      <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-surface-100">{value}</p>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = loadStoredAuth();
    if (!auth) {
      router.push("/login");
      return;
    }

    api.setToken(auth.access_token);

    async function loadData() {
      try {
        const [analyticsData, tipsData] = await Promise.allSettled([
          api.request<Analytics>("/profiles/me/analytics"),
          api.getMyReceivedTips(1, 5),
        ]);

        if (analyticsData.status === "fulfilled") {
          setAnalytics(analyticsData.value);
        }
        if (tipsData.status === "fulfilled") {
          setTips(tipsData.value.data);
        }
      } catch {
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton variant="text" width="200px" height="28px" />
          <Skeleton variant="text" width="300px" height="16px" className="mt-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <Skeleton variant="text" width="100px" height="14px" />
              <Skeleton variant="text" width="80px" height="28px" className="mt-2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Dashboard</h1>
        </div>
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Dashboard</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Overview of your tips and earnings
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Earnings"
          value={analytics?.totalEarnings != null ? `${analytics.totalEarnings} XLM` : "--"}
        />
        <StatCard
          title="Tips Received"
          value={analytics?.tipsReceived != null ? String(analytics.tipsReceived) : "--"}
        />
        <StatCard
          title="Avg. Tip"
          value={analytics?.averageTip != null ? `${analytics.averageTip} XLM` : "--"}
        />
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
          Recent tips
        </h2>
        {tips.length === 0 ? (
          <p className="mt-4 text-sm text-surface-500 dark:text-surface-400">
            No tips received yet.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="flex items-center justify-between rounded-lg border border-surface-200 p-3 dark:border-surface-700"
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                      {tip.senderWallet
                        ? `${tip.senderWallet.slice(0, 6)}...${tip.senderWallet.slice(-4)}`
                        : "Anonymous"}
                    </p>
                    <p className="text-xs text-surface-500">
                      {new Date(tip.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-primary-600">
                  +{tip.amount} {tip.asset}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
