import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tool } from '@/lib/db-types';
import { ToolsClientPage } from './tools-client-page';

export default async function ToolsPage(props: {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let favoriteToolIds: number[] = [];

  if (user) {
    const { data: favorites } = await supabase
      .from('favorites')
      .select('tool_id')
      .eq('user_id', user.id);

    favoriteToolIds = favorites?.map((f) => f.tool_id) || [];
  }

  let query = supabase.from('tools').select('*, categories(category_name)');

  if (searchParams?.q) {
    query = query.ilike('name', `%${searchParams.q}%`);
  }

  const { data: dbTools, error } = await query;

  // if (error) {
  //   console.error('Error fetching tools:', error);
  // }

  const uniqueTools = dbTools || [];

  const allCategories = uniqueTools
    .map((tool) => tool.categories?.category_name)
    .filter((c): c is string => !!c);
  const uniqueCategories = ['All', ...Array.from(new Set(allCategories))];

  const selectedCategory = searchParams?.category;

  const categorizedTools =
    selectedCategory && selectedCategory !== 'All'
      ? uniqueTools.filter(
          (tool) => tool.categories?.category_name === selectedCategory
        )
      : uniqueTools;

  // Pagination Logic
  const pageSize = 5;
  const totalTools = categorizedTools.length;
  const totalPages = Math.ceil(totalTools / pageSize);

  const rawPage = Number(searchParams?.page || '1');

  const currentPage = Math.min(
    Math.max(rawPage, 1),
    totalPages || 1
  );

  const paginatedTools = categorizedTools.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <ToolsClientPage
      tools={paginatedTools}
      categories={uniqueCategories}
      searchParams={searchParams}
      currentPage={currentPage}
      totalPages={totalPages}
      favoriteToolIds={favoriteToolIds}
    />
  );
}
