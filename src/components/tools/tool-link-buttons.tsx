'use client';

import * as React from 'react';
import { Github, Bookmark, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Tool } from '@/lib/db-types';
import { toggleFavorite } from '@/lib/actions/favorites';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ToolLinkButtonsProps = {
  tool: Tool;
  onButtonClick?: (e: React.MouseEvent) => void;
  buttonSize?: 'sm' | 'default' | 'lg' | 'icon' | null | undefined;
  isSaved?: boolean;
  className?: string;
};

export function ToolLinkButtons({
  tool,
  onButtonClick,
  buttonSize = 'default',
  isSaved,
  className,
}: ToolLinkButtonsProps) {
  const [saved, setSaved] = React.useState(isSaved ?? false);
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setSaved(isSaved ?? false);
  }, [isSaved]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onButtonClick?.(e);

    const previousSaved = saved;
    const newSaved = !saved;
    setSaved(newSaved);
    setLoading(true);

    const result = await toggleFavorite(tool.id);
    
    setLoading(false);
    if (result.error) {
      setSaved(previousSaved);
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        variant={saved ? 'secondary' : 'default'}
        size={buttonSize}
        onClick={handleSave}
        disabled={loading}
        className="flex-1 min-w-[100px]"
      >
        <Bookmark className={cn("h-4 w-4 mr-2", saved ? 'fill-current' : '')} />
        {loading ? '...' : saved ? 'Saved' : 'Save'}
      </Button>

      {tool.url && (
        <Button 
          asChild 
          size={buttonSize} 
          variant="secondary"
          className="flex-1 min-w-[100px]"
        >
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onButtonClick}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            Website
          </a>
        </Button>
      )}
      
      {tool.github_url && (
        <Button
          asChild
          variant="secondary"
          size={buttonSize}
          className="flex-1 min-w-[100px]"
        >
          <a
            href={tool.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onButtonClick}
            className="flex items-center gap-2"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </Button>
      )}
    </div>
  );
}
