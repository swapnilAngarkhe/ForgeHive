
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Tool } from '@/lib/db-types';
import { ToolsClientPage } from './tools-client-page';

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
    <ToolsClientPage
      tools={filteredTools}
      categories={uniqueCategories}
      searchParams={searchParams}
    />
  );
}
