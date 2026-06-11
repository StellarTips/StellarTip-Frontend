import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Copy } from "lucide-react";
import Link from "next/link";

interface CreatorProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: CreatorProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  return createMetadata({ title: `${username}'s Profile` });
}

export default async function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  const { username } = await params;

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="text-center">
          <Avatar size="xl" fallback={username} className="mx-auto" />
          <h1 className="mt-4 text-2xl font-bold text-surface-900 dark:text-surface-100">
            @{username}
          </h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Creator on the Stellar network
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge variant="primary">Verified</Badge>
            <Badge variant="outline">Testnet</Badge>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href={`/tip/${username}`}>
              <Button size="lg">Send a tip</Button>
            </Link>
            <Button variant="outline" size="lg">
              <Copy className="h-4 w-4 mr-1.5" />
              Copy link
            </Button>
          </div>
        </Card>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <Card className="text-center">
            <p className="text-2xl font-bold text-primary-600">1.2k</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">Tips received</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-primary-600">8.5k</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">XLM earned</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-primary-600">42</p>
            <p className="text-sm text-surface-500 dark:text-surface-400">Supporters</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
