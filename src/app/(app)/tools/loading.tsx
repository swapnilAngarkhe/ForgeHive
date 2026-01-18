import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="flex w-full h-full">
      {/* Left Sidebar Skeleton */}
      <aside className="w-64 shrink-0 border-r border-border hidden md:flex flex-col">
        <div className="sticky top-16 h-[calc(100vh-4rem)] p-6 overflow-y-auto">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="flex flex-col gap-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        </div>
      </aside>

      {/* Right Content Skeleton */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          {/* Search Skeleton */}
          <div className="flex w-full items-center space-x-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>

          {/* List Skeleton */}
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4 flex gap-6 items-start">
                <Skeleton className="h-24 w-24 flex-shrink-0 rounded-md" />
                <div className="flex-1 space-y-2 mt-1">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-5 w-20 mt-2" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
