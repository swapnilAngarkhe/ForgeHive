'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Tool } from '@/lib/db-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToolLinkButtons } from './tool-link-buttons';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

type ToolCardProps = {
  tool: Tool;
  isSaved: boolean;
  className?: string;
  user: User | null;
  onTagClick?: (category: string) => void;
};

export function ToolCard({ tool, isSaved, className, user, onTagClick }: ToolCardProps) {
  return (
    <Card className={cn("overflow-hidden flex flex-col h-full", className)}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        {tool.logo_url && (
          <div className="relative h-12 w-12 flex-shrink-0 bg-muted/20 rounded-md p-2">
            <Image
              src={tool.logo_url}
              alt={tool.name}
              fill
              className="object-contain"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-xl font-bold font-headline truncate">
              {tool.name}
            </CardTitle>
          </div>
          {tool.categories && (
            <div className="mt-1">
              {onTagClick ? (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(tool.categories.category_name);
                  }}
                >
                  #{tool.categories.category_name}
                </Badge>
              ) : (
                <Link
                  href={`/tools?category=${tool.categories.category_name}`}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-block"
                >
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    #{tool.categories.category_name}
                  </Badge>
                </Link>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 flex-1">
        <p className="text-muted-foreground text-sm line-clamp-3">
          {tool.description}
        </p>
        
        <div className="mt-auto pt-4 border-t">
          <ToolLinkButtons
            tool={tool}
            isSaved={isSaved}
            buttonSize="sm"
            user={user}
          />
        </div>
      </CardContent>
    </Card>
  );
}
