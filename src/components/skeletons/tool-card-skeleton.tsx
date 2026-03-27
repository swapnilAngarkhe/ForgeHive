'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ToolCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full border border-border/50 animate-pulse">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4 pb-2">
        {/* Logo */}
        <Skeleton className="h-10 w-10 flex-shrink-0 rounded-md bg-muted/40" />
        
        <div className="flex-1 space-y-2">
          {/* Title */}
          <Skeleton className="h-5 w-2/3 bg-muted/40" />
          {/* Tag */}
          <Skeleton className="h-4 w-1/4 bg-muted/30" />
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-3 flex-1 p-4 pt-0">
        {/* Description */}
        <div className="space-y-2 mt-2">
          <Skeleton className="h-3 w-full bg-muted/30" />
          <Skeleton className="h-3 w-5/6 bg-muted/30" />
        </div>
        
        {/* Buttons */}
        <div className="mt-auto pt-3 border-t flex gap-2">
          <Skeleton className="h-8 flex-1 bg-muted/40" />
          <Skeleton className="h-8 flex-1 bg-muted/40" />
        </div>
      </CardContent>
    </Card>
  );
}
