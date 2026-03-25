'use client';

import * as React from 'react';
import { Github, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Tool } from '@/lib/db-types';
import { toggleFavorite } from '@/lib/actions/favorites';
import { useToast } from '@/hooks/use-toast';

type ToolLinkButtonsProps = {
  tool: Tool;
  onButtonClick?: (e: React.MouseEvent) => void;
  buttonSize?: 'sm' | 'default' | 'lg' | 'icon' | null | undefined;
  isSaved?: boolean;
};

export function ToolLinkButtons({
  tool,
  onButtonClick,
  buttonSize = 'default',
  isSaved,
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
    <>
      <Button
        variant={saved ? 'default' : 'outline'}
        size={buttonSize}
        onClick={handleToggleFavorite}
      >
        <Bookmark className={saved ? 'fill-current' : ''} />
        {saved ? 'Saved' : 'Save'}
      </Button>

      {tool.url && (
        <Button asChild size={buttonSize} variant="secondary">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onButtonClick}
          >
            Visit Website
          </a>
        </Button>
      )}
      {tool.github_url && (
        <Button
          asChild
          variant="secondary"
          size={buttonSize}
        >
          <a
            href={tool.github_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onButtonClick}
          >
            <Github />
            GitHub
          </a>
        </Button>
      )}
    </>
  );
}
