
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
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
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Tool } from '@/lib/db-types';
import { Input } from '@/components/ui/input';

const defaultTools: Tool[] = [
  {
    id: 1,
    name: 'ShadCN UI',
    slug: 'shadcn-ui',
    description:
      'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
    url: 'https://ui.shadcn.com/',
    category_id: 1,
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { category_name: 'UI' },
  },
  {
    id: 2,
    name: 'Supabase',
    slug: 'supabase',
    description:
      'The open source Firebase alternative. Create a backend in less than 2 minutes. Start your project with a Postgres database, Authentication, instant APIs, and so much more.',
    url: 'https://supabase.io/',
    category_id: 2,
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { category_name: 'Backend Services' },
  },
  {
    id: 3,
    name: 'Next.js',
    slug: 'next-js',
    description:
      'The React Framework for Production. Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed.',
    url: 'https://nextjs.org/',
    category_id: 3,
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { category_name: 'Frameworks' },
  },
  {
    id: 4,
    name: 'Tailwind CSS',
    slug: 'tailwind-css',
    description:
      'A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.',
    url: 'https://tailwindcss.com/',
    category_id: 1,
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { category_name: 'CSS' },
  },
  {
    id: 5,
    name: 'Lucide',
    slug: 'lucide',
    description:
      'A community-run fork of the Feather icon set, with over 850 icons. It is a highly customizable and lightweight icon library.',
    url: 'https://lucide.dev/',
    category_id: 4,
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { category_name: 'Icons' },
  },
  {
    id: 6,
    name: 'Obsidian',
    slug: 'obsidian',
    description:
      'Obsidian is a powerful knowledge base on top of a local folder of plain text Markdown files.',
    url: 'https://obsidian.md/',
    category_id: 5,
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { category_name: 'Productivity' },
  },
  {
    id: 7,
    name: 'Lodash',
    slug: 'lodash',
    description:
      'A modern JavaScript utility library delivering modularity, performance & extras.',
    url: 'https://lodash.com/',
    category_id: 6,
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { category_name: 'Javascript' },
  },
  {
    id: 8,
    name: 'zx',
    slug: 'zx',
    description:
      'A tool for writing better scripts. It provides useful wrappers around child_process, escapes arguments and gives sensible defaults.',
    url: 'https://github.com/google/zx',
    category_id: 7,
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    categories: { category_name: 'Scripting' },
  },
];

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

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    category?: string;
  };
}) {
  const supabase = createClient();

  let query = supabase.from('tools').select('*, categories(category_name)');

  if (searchParams?.q) {
    query = query.ilike('name', `%${searchParams.q}%`);
  }

  const { data: dbTools, error } = await query;

  const allTools = [...defaultTools, ...(dbTools || [])];

  const uniqueTools = Array.from(
    new Map(allTools.map((tool) => [tool.name, tool])).values()
  );

  const allCategories = uniqueTools
    .map((tool) => tool.categories?.category_name)
    .filter((c): c is string => !!c);
  const uniqueCategories = ['All', ...Array.from(new Set(allCategories))];

  const selectedCategory = searchParams?.category;

  const filteredTools =
    selectedCategory && selectedCategory !== 'All'
      ? uniqueTools.filter(
          (tool) => tool.categories.category_name === selectedCategory
        )
      : uniqueTools;

  if (error) {
    console.error('Error fetching tools:', error);
  }

  return (
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
          {uniqueCategories.map((category) => {
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
                    selectedCategory === category ||
                    (!selectedCategory && category === 'All')
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
        {filteredTools && filteredTools.length > 0 ? (
          filteredTools.map((tool) => {
            const image = getToolImage(tool as Tool);
            return (
              <Card key={tool.id} className="flex flex-col">
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
                  <Button asChild>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10">
            <p>No tools found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
