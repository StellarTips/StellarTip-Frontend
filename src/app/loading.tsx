import { SkeletonCard } from "@/components/ui/Skeleton";

export default function LoadingPage() {
  return (
    <div className="container-page py-12">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
