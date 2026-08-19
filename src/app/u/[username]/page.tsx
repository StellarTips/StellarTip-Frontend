import { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Copy } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { User } from "@/types/index";

interface CreatorProfilePageProps {
  params: Promise<{ username: string }>;
}

async function fetchProfile(username: string): Promise<User | null> {
  try {
    return await api.getProfile(username);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: CreatorProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await fetchProfile(username);

  if (!profile) {
    return createMetadata({ title: "Profile not found", noIndex: true });
  }

  return createMetadata({
    title: profile.displayName
      ? `${profile.displayName} (@${profile.username})`
      : `@${profile.username}`,
    description: profile.bio ?? `${profile.username} on StellarTip`,
  });
}

export default async function CreatorProfilePage({ params }: CreatorProfilePageProps) {
  const { username } = await params;
  const profile = await fetchProfile(username);

  if (!profile) {
    return (
      <div className="container-page py-12">
        <div className="mx-auto max-w-2xl">
          <Card className="text-center">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              Profile not found
            </h1>
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
              The creator @{username} does not exist or is unavailable.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm font-medium text-primary-600 hover:underline"
            >
              Go home
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="text-center">
          <Avatar
            size="xl"
            src={profile.avatarUrl}
            fallback={profile.username}
            className="mx-auto"
          />
          <h1 className="mt-4 text-2xl font-bold text-surface-900 dark:text-surface-100">
            @{profile.username}
          </h1>
          {profile.displayName && (
            <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
              {profile.displayName}
            </p>
          )}
          {profile.bio && (
            <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">{profile.bio}</p>
          )}
          <div className="mt-4 flex items-center justify-center gap-2">
            <Badge variant="primary">Verified</Badge>
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
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="text-center">
          <Skeleton variant="circle" width="80px" height="80px" className="mx-auto" />
          <Skeleton variant="text" width="40%" height="24px" className="mx-auto mt-4" />
          <Skeleton variant="text" width="60%" height="16px" className="mx-auto mt-2" />
          <div className="mt-4 flex justify-center gap-2">
            <Skeleton variant="rect" width="80px" height="24px" />
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <Skeleton variant="rect" width="120px" height="40px" />
            <Skeleton variant="rect" width="120px" height="40px" />
          </div>
        </Card>
      </div>
    </div>
  );
}
