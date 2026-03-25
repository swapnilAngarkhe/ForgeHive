'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { Tool } from '@/lib/db-types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToolLinkButtons } from './tool-link-buttons';
import { cn } from '@/lib/utils';

type ToolCardProps = {
  tool: Tool;
  isSaved: boolean;
  className?: string;
};

export function ToolCard({ tool, isSaved, className }: ToolCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <motion.div
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "cursor-pointer overflow-hidden transition-all duration-300",
          isExpanded 
            ? "w-full z-10" 
            : "w-20 h-20 md:w-24 md:h-24 mx-auto"
        )}
      >
        {!isExpanded ? (
          <Card className="w-full h-full flex items-center justify-center p-3 hover:border-accent hover:bg-accent/5 transition-colors">
            {tool.logo_url && (
              <div className="relative w-full h-full">
                <Image
                  src={tool.logo_url}
                  alt={tool.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </Card>
        ) : (
          <Card className="w-full p-6 shadow-2xl border-accent/30 bg-card/95 backdrop-blur-sm">
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-6">
                {tool.logo_url && (
                  <div className="relative h-16 w-16 flex-shrink-0 bg-muted/20 rounded-md p-2">
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
                    <h3 className="text-xl font-bold font-headline truncate">
                      {tool.name}
                    </h3>
                    <motion.button
                      className="text-muted-foreground hover:text-foreground text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(false);
                      }}
                    >
                      Collapse
                    </motion.button>
                  </div>
                  {tool.categories && (
                    <Badge variant="secondary" className="mt-1">
                      #{tool.categories.category_name}
                    </Badge>
                  )}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
                
                <ToolLinkButtons
                  tool={tool}
                  isSaved={isSaved}
                  buttonSize="sm"
                  onButtonClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
