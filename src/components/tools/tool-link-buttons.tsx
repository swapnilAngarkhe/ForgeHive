'use client';

import * as React from 'react';
import { Github, Bookmark, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Tool } from '@/lib/db-types';
import { toggleFavorite } from '@/lib/actions/favorites';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

type ToolLinkButtonsProps = {
  tool: Tool;
  onButtonClick?: (e: React.MouseEvent) => void;
  buttonSize?: 'sm' | 'default' | 'lg' | 'icon' | null | undefined;
  isSaved?: boolean;
  className?: string;
  user: User | null;
};

export function ToolLinkButtons({
  tool,
  onButtonClick,
  buttonSize = 'default',
  isSaved,
  className,
  user,
}: ToolLinkButtonsProps) {
  const [saved, setSaved] = React.useState(isSaved ?? false);
  const { toast } = useToast();

  React.useEffect(() => {
    setSaved(isSaved ?? false);
  }, [isSaved]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onButtonClick?.(e);

    if (!user) {
      window.location.href = '/login';
      return;
    }

    // 🔥 Optimistic update (instant UI change)
    setSaved((prev) => !prev);

    try {
      const result = await toggleFavorite(tool.id);
      
      if (result.error) {
        setSaved((prev) => !prev);
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      setSaved((prev) => !prev);
      console.error('Failed to toggle favorite:', error);
      toast({
        title: 'Network Error',
        description: 'Failed to update favorites. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <Button
        variant={saved ? 'subtle' : 'default'}
        size={buttonSize}
        onClick={handleSave}
        className="flex-1 text-xs h-8"
      >
        <Bookmark className={cn("h-3 w-3 mr-1.5", saved ? 'fill-current' : '')} />
        {saved ? 'Saved' : 'Save'}
      </Button>

      {tool.url && (
        <Button 
          asChild 
          size={buttonSize} 
          variant="subtle"
          className="flex-1 text-xs h-8"
        >
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              onButtonClick?.(e);
            }}
            className="flex items-center gap-1.5"
          >
            <Globe className="h-3 w-3" />
            Website
          </a>
        </Button>
      )}
      
      {tool.github_url && (
        <Button
          asChild
          variant="subtle"
          size={buttonSize}
          className="flex-1 text-xs h-8"
        >
          <a
            href={tool.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              onButtonClick?.(e);
            }}
            className="flex items-center gap-1.5"
          >
            <Github className="h-3 w-3" />
            GitHub
          </a>
        </Button>
      )}
    </div>
  );
}
