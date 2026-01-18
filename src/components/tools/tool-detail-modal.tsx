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
  image: { imageUrl: string; imageHint: string } | undefined;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

export function ToolDetailModal({
  tool,
  image,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
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
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the card
          >
            <Card className="flex flex-col h-[70vh] max-h-[600px]">
              {image && (
                <div className="relative h-48 w-full flex-shrink-0">
                  <Image
                    src={image.imageUrl}
                    alt={tool.name}
                    fill
                    className="object-cover rounded-t-lg"
                    data-ai-hint={image.imageHint}
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{tool.name}</CardTitle>
                <CardDescription className="line-clamp-none max-h-48 overflow-y-auto">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {tool.categories && (
                  <Badge variant="secondary">
                    #{tool.categories.category_name}
                  </Badge>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <ToolLinkButtons tool={tool} />
              </CardFooter>
            </Card>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-card rounded-full border"
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
              className="absolute left-4 md:left-10 h-12 w-12 flex items-center justify-center bg-card rounded-full border"
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
              className="absolute right-4 md:right-10 h-12 w-12 flex items-center justify-center bg-card rounded-full border"
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
