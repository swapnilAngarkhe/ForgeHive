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
  variant?: 'compact' | 'full';
};

export function ToolLinkButtons({
  tool,
  onButtonClick,
  buttonSize = 'default',
  isSaved,
  className,
  variant = 'full',
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
        size={buttonSize === 'sm' ? 'icon' : (variant === 'compact' ? 'icon' : buttonSize)}
        onClick={handleSave}
        disabled={loading}
        className={cn(variant === 'full' && "flex-1 min-w-[100px] h-9")}
      >
        {variant === 'compact' ? (
          <Bookmark className={cn("h-4 w-4", saved ? 'fill-current' : '')} />
        ) : loading ? (
          '...'
        ) : saved ? (
          'Saved'
        ) : (
          'Save'
        )}
      </Button>

      {tool.url && (
        <Button 
          asChild 
          size={variant === 'compact' ? 'icon' : buttonSize} 
          variant="secondary"
          className={cn(variant === 'full' && "flex-1 min-w-[100px] h-9")}
        >
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onButtonClick}
            className="flex items-center gap-2"
          >
            {variant === 'compact' ? (
              <Globe className="h-4 w-4" />
            ) : (
              'Visit Website'
            )}
          </a>
        </Button>
      )}
      
      {tool.github_url && (
        <Button
          asChild
          variant={tool.url ? 'secondary' : 'default'}
          size={variant === 'compact' ? 'icon' : buttonSize}
          className={cn(variant === 'full' && "flex-1 min-w-[100px] h-9")}
        >
          <a
            href={tool.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onButtonClick}
            className="flex items-center gap-2"
          >
            {variant === 'compact' ? (
              <Github className="h-4 w-4" />
            ) : (
              <>
                <Github className="h-4 w-4" />
                GitHub
              </>
            )}
          </a>
        </Button>
      )}
    </div>
  );
}
