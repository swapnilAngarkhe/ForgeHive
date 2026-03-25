'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { Tool } from '@/lib/db-types';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ToolLinkButtons } from './tool-link-buttons';

type ToolDetailModalProps = {
  tool: Tool | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  favoriteToolIds: number[];
};

export function ToolDetailModal({
  tool,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  favoriteToolIds,
}: ToolDetailModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight' && hasNext) {
        onNext();
      } else if (event.key === 'ArrowLeft' && hasPrevious) {
        onPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onNext, onPrevious, hasNext, hasPrevious]);

  return (
    <AnimatePresence>
      {tool && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            layoutId={`card-${tool.id}`}
            className="w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="flex flex-col h-[70vh] max-h-[600px] overflow-hidden">
              <CardHeader className="text-center pb-2">
                {tool?.logo_url && (
                  <div className="relative h-24 w-24 mx-auto mb-4 bg-muted/20 rounded-md p-4">
                    <Image
                      src={tool.logo_url}
                      alt={tool.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <CardTitle className="text-2xl font-bold">{tool.name}</CardTitle>
                <div className="flex justify-center mt-2">
                  {tool.categories && (
                    <Badge variant="secondary">
                      #{tool.categories.category_name}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto px-6 py-4">
                <CardDescription className="text-base leading-relaxed text-foreground/90">
                  {tool.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center gap-3 p-6 border-t">
                <ToolLinkButtons 
                  tool={tool} 
                  isSaved={favoriteToolIds.includes(tool.id)}
                />
              </CardFooter>
            </Card>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-card rounded-full border shadow-sm hover:bg-accent transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </motion.button>

          {hasPrevious && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
              exit={{ opacity: 0, x: 20 }}
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              className="absolute left-4 md:left-10 h-12 w-12 flex items-center justify-center bg-card rounded-full border shadow-sm hover:bg-accent transition-colors"
              aria-label="Previous tool"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
          )}

          {hasNext && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
              exit={{ opacity: 0, x: -20 }}
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 md:right-10 h-12 w-12 flex items-center justify-center bg-card rounded-full border shadow-sm hover:bg-accent transition-colors"
              aria-label="Next tool"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
