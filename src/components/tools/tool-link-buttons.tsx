import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Tool } from '@/lib/db-types';

type ToolLinkButtonsProps = {
  tool: Tool;
  onButtonClick?: (e: React.MouseEvent) => void;
  buttonSize?: 'sm' | 'default' | 'lg' | 'icon' | null | undefined;
};

export function ToolLinkButtons({
  tool,
  onButtonClick,
  buttonSize = 'default',
}: ToolLinkButtonsProps) {
  if (!tool.url && !tool.github_url) {
    return null;
  }

  return (
    <>
      {tool.url && (
        <Button asChild size={buttonSize}>
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
          variant={tool.url ? 'secondary' : 'default'}
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
