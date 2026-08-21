import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

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
