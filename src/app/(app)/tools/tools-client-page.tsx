'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Tool } from '@/lib/db-types';
import { ToolDetailModal } from '@/components/tools/tool-detail-modal';
import { ToolLinkButtons } from '@/components/tools/tool-link-buttons';

function getToolImage(tool: Tool) {
  const uiImage = PlaceHolderImages.find((img) => img.id === 'ui-tool-1');
  const apiImage = PlaceHolderImages.find((img) => img.id === 'api-tool-1');
  const prodImage = PlaceHolderImages.find(
    (img) => img.id === 'productivity-1'
  );

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

  const currentCategory = searchParams?.category || 'All';

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
      <div className="flex w-full h-full">
        {/* Left Sidebar */}
        <aside className="w-64 shrink-0 border-r border-border hidden md:flex flex-col">
          <div className="sticky top-16 h-[calc(100vh-4rem)] p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 font-headline">
              Categories
            </h2>
            <div className="flex flex-col gap-2">
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
                  <Button
                    key={category}
                    asChild
                    variant={
                      currentCategory === category ? 'default' : 'ghost'
                    }
                    className="justify-start"
                  >
                    <Link href={href}>#{category}</Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="flex-1 p-6 md:p-10 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <form className="flex w-full items-center space-x-2">
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

            {/* Mobile categories - visible only on mobile */}
            <div className="flex items-center flex-wrap gap-2 md:hidden">
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
                        currentCategory === category ? 'default' : 'secondary'
                      }
                      className="cursor-pointer"
                    >
                      #{category}
                    </Badge>
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-4">
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
                      <Card className="p-4 flex flex-col md:flex-row gap-6 items-start hover:bg-card/80 transition-colors">
                        {image && (
                          <div className="relative h-24 w-24 flex-shrink-0">
                            <Image
                              src={image.imageUrl}
                              alt={tool.name}
                              fill
                              className="object-cover rounded-md"
                              data-ai-hint={image.imageHint}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold font-headline">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-2">
                            {tool.description}
                          </p>
                          {tool.categories && (
                            <Badge variant="secondary">
                              #{tool.categories.category_name}
                            </Badge>
                          )}
                        </div>
                        <div className="w-full md:w-auto flex flex-row md:flex-col gap-2 items-center self-start md:self-center flex-shrink-0">
                          <ToolLinkButtons
                            tool={tool}
                            buttonSize="sm"
                            onButtonClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <p>No tools found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
