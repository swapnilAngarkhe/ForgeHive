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

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    category?: string;
  };
}) {
  const supabase = createClient();

  let query = supabase
    .from('tools')
    .select('*, categories(category_name)');

  if (searchParams?.q) {
    query = query.ilike('name', `%${searchParams.q}%`);
  }

  const { data: tools, error } = await query;

  if (error) {
    console.error('Error fetching tools:', error);
    // You can render an error state here
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools && tools.length > 0 ? (
        tools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader>
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tool.categories && (
                <Badge variant="secondary">{tool.categories.category_name}</Badge>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  Visit
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>No tools found.</p>
      )}
    </div>
  );
}
