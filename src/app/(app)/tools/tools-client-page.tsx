'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Tool } from '@/lib/db-types';
import { ToolDetailModal } from '@/components/tools/tool-detail-modal';
import { ToolLinkButtons } from '@/components/tools/tool-link-buttons';

type ToolsClientPageProps = {
  tools: Tool[];
  categories: string[];
  searchParams?: {
    q?: string;
    category?: string;
    page?: string;
  };
  currentPage: number;
  totalPages: number;
};

function PaginationControls({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center pt-8 gap-4">
      {currentPage > 1 && (
        <Button asChild variant="outline">
          <Link href={createPageURL(currentPage - 1)}>← Previous</Link>
        </Button>
      )}
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <Button asChild variant="outline">
          <Link href={createPageURL(currentPage + 1)}>Next →</Link>
        </Button>
      )}
    </div>
  );
}

export function ToolsClientPage({
  tools,
  categories,
  searchParams,
  currentPage,
  totalPages,
}: ToolsClientPageProps) {
  const [selectedToolIndex, setSelectedToolIndex] = React.useState<
    number | null
  >(null);
  const routerSearchParams = useSearchParams();

  React.useEffect(() => {
    setSelectedToolIndex(null);
  }, [routerSearchParams]);

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
                const params = new URLSearchParams(searchParams);
                if (category === 'All') {
                  params.delete('category');
                } else {
                  params.set('category', category);
                }
                params.set('page', '1');
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
              <input type="hidden" name="page" value="1" />
              <Button type="submit">Search</Button>
            </form>

            {/* Mobile categories - visible only on mobile */}
            <div className="flex items-center flex-wrap gap-2 md:hidden">
              <span className="text-sm font-semibold">Categories:</span>
              {categories.map((category) => {
                const params = new URLSearchParams(searchParams);
                if (category === 'All') {
                  params.delete('category');
                } else {
                  params.set('category', category);
                }
                params.set('page', '1');
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
                  return (
                    <motion.div
                      key={tool.id}
                      layoutId={`card-${tool.id}`}
                      onClick={() => setSelectedToolIndex(index)}
                      className="cursor-pointer"
                    >
                      <Card className="p-4 flex flex-col md:flex-row gap-6 items-start hover:bg-card/80 transition-colors">
                        {tool.logo_url && (
                          <div className="relative h-20 w-20 flex-shrink-0 bg-muted/20 rounded-md p-3 flex items-center justify-center">
                            <Image
                              src={tool.logo_url}
                              alt={tool.name}
                              fill
                              className="object-contain"
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
            {totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
