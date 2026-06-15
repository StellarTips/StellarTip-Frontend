import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

function StatCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <Card>
      <p className="text-sm text-surface-500 dark:text-surface-400">{title}</p>
      <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-surface-100">{value}</p>
      <p className="mt-1 text-xs text-green-600 dark:text-green-400">{change}</p>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Dashboard</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Overview of your tips and earnings
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Earnings" value="12,450 XLM" change="+8% this month" />
        <StatCard title="Tips Received" value="342" change="+12 this week" />
        <StatCard title="Avg. Tip" value="36.4 XLM" change="+2.1 XLM" />
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Recent tips
          </h2>
          <Badge variant="primary">Live</Badge>
        </div>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-surface-200 p-3 dark:border-surface-700"
            >
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" width="32px" height="32px" />
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                    Anonymous
                  </p>
                  <p className="text-xs text-surface-500">2 hours ago</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-primary-600">+50 XLM</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
