'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Tool } from '@/lib/db-types';
import { ToolDetailModal } from '@/components/tools/tool-detail-modal';

function getToolImage(tool: Tool) {
  const uiImage = PlaceHolderImages.find((img) => img.id === 'ui-tool-1');
  const apiImage = PlaceHolderImages.find((img) => img.id === 'api-tool-1');
  const prodImage = PlaceHolderImages.find((img) => img.id === 'productivity-1');

  switch (tool.categories.category_name) {
    case 'UI':
    case 'CSS':
    case 'Icons':
    case 'Frameworks':
      return uiImage;
    case 'Backend Services':
    case 'Javascript':
    case 'Scripting':
      return apiImage;
    case 'Productivity':
      return prodImage;
    default:
      return uiImage;
  }
}

type ToolsClientPageProps = {
  tools: Tool[];
  categories: string[];
  searchParams?: {
    q?: string;
    category?: string;
  };
};

export function ToolsClientPage({
  tools,
  categories,
  searchParams,
}: ToolsClientPageProps) {
  const [selectedToolIndex, setSelectedToolIndex] = React.useState<
    number | null
  >(null);

  const handleNext = () => {
    if (selectedToolIndex !== null && selectedToolIndex < tools.length - 1) {
      setSelectedToolIndex(selectedToolIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedToolIndex !== null && selectedToolIndex > 0) {
      setSelectedToolIndex(selectedToolIndex - 1);
    }
  };

  const selectedTool =
    selectedToolIndex !== null ? tools[selectedToolIndex] : null;

  return (
    <>
      <ToolDetailModal
        tool={selectedTool}
        image={selectedTool ? getToolImage(selectedTool as Tool) : undefined}
        onClose={() => setSelectedToolIndex(null)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={
          selectedToolIndex !== null && selectedToolIndex < tools.length - 1
        }
        hasPrevious={selectedToolIndex !== null && selectedToolIndex > 0}
      />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <form className="flex w-full max-w-lg items-center space-x-2">
            <Input
              type="search"
              name="q"
              placeholder="Search tools..."
              className="flex-1"
              defaultValue={searchParams?.q || ''}
            />
            {searchParams?.category && searchParams.category !== 'All' && (
              <input
                type="hidden"
                name="category"
                value={searchParams.category}
              />
            )}
            <Button type="submit">Search</Button>
          </form>

          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm font-semibold">Categories:</span>
            {categories.map((category) => {
              const params = new URLSearchParams();
              if (searchParams?.q) {
                params.set('q', searchParams.q);
              }
              if (category !== 'All') {
                params.set('category', category);
              }
              const queryString = params.toString();
              const href = queryString ? `/tools?${queryString}` : '/tools';

              return (
                <Link key={category} href={href}>
                  <Badge
                    variant={
                      searchParams?.category === category ||
                      (!searchParams?.category && category === 'All')
                        ? 'default'
                        : 'secondary'
                    }
                    className="cursor-pointer"
                  >
                    #{category}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools && tools.length > 0 ? (
            tools.map((tool, index) => {
              const image = getToolImage(tool as Tool);
              return (
                <motion.div
                  key={tool.id}
                  layoutId={`card-${tool.id}`}
                  onClick={() => setSelectedToolIndex(index)}
                  className="cursor-pointer"
                >
                  <Card className="flex flex-col h-full">
                    {image && (
                      <div className="relative h-48 w-full">
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
                      <CardDescription className="line-clamp-2 h-10">
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
                    <CardFooter>
                      {(tool.url || tool.github_url) && (
                        <Button asChild>
                          <a
                            href={tool.url || tool.github_url!}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Visit
                          </a>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10">
              <p>No tools found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
