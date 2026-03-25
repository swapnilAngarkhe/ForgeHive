'use client';

import * as React from 'react';
import { Github, Bookmark, ExternalLink } from 'lucide-react';
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
  const { toast } = useToast();

  React.useEffect(() => {
    setSaved(isSaved ?? false);
  }, [isSaved]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onButtonClick?.(e);

    const previousSaved = saved;
    const newSaved = !saved;
    setSaved(newSaved);

    const result = await toggleFavorite(tool.id);
    
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
        variant={saved ? 'default' : 'outline'}
        size={buttonSize}
        onClick={handleToggleFavorite}
        className="flex-1 min-w-[100px] h-9"
      >
        <Bookmark className={cn("h-4 w-4", saved ? 'fill-current' : '')} />
        <span>{saved ? 'Saved' : 'Save'}</span>
      </Button>

      {tool.url && (
        <Button 
          asChild 
          size={buttonSize} 
          variant="secondary"
          className="flex-1 min-w-[100px] h-9"
        >
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onButtonClick}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Visit Site</span>
          </a>
        </Button>
      )}
      
      {tool.github_url && (
        <Button
          asChild
          variant="secondary"
          size={buttonSize}
          className="flex-1 min-w-[100px] h-9"
        >
          <a
            href={tool.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onButtonClick}
            className="flex items-center gap-2"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </Button>
      )}
    </div>
  );
}
