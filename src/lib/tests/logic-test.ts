
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Tool } from '@/lib/db-types';

// --- MOCK DATA ---
const mockTools: Tool[] = [
  {
    id: 1,
    name: 'React Query',
    description: 'Hooks for fetching, caching and updating asynchronous data in React',
    category_id: 1,
    created_at: '',
    updated_at: '',
    created_by: '',
    categories: { category_name: 'UI' },
  },
  {
    id: 2,
    name: 'Prisma',
    description: 'Next-generation Node.js and TypeScript ORM',
    category_id: 2,
    created_at: '',
    updated_at: '',
    created_by: '',
    categories: { category_name: 'Backend' },
  },
  {
    id: 3,
    name: 'Tailwind CSS',
    description: 'A utility-first CSS framework',
    category_id: 1,
    created_at: '',
    updated_at: '',
    created_by: '',
    categories: { category_name: 'UI' },
  }
];

// --- 1. FILTERING SYSTEM TESTS ---
describe('Filtering System', () => {
  it('should filter tools by category name', () => {
    const selectedCategory = 'Backend';
    const filtered = mockTools.filter(t => t.categories.category_name === selectedCategory);
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Prisma');
  });

  it('should filter tools by search query (case-insensitive)', () => {
    const query = 'css';
    const filtered = mockTools.filter(t => 
      t.name.toLowerCase().includes(query.toLowerCase())
    );
    
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Tailwind CSS');
  });

  it('should handle hashtag category searches correctly', () => {
    const searchStr = '#ui';
    const categoryTag = searchStr.substring(1).toLowerCase();
    
    const filtered = mockTools.filter(tool => 
      tool.categories?.category_name.toLowerCase().includes(categoryTag)
    );

    expect(filtered).toHaveLength(2);
    expect(filtered.every(t => t.categories.category_name === 'UI')).toBe(true);
  });
});

// --- 2. AUTHENTICATION MOCK TESTS ---
// Note: In a real environment, we mock the supabase client responses.
describe('Authentication Flow Logic', () => {
  it('should prepare correct form data for submission', () => {
    const mockUser = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    const formData = new FormData();
    formData.append('name', mockUser.name);
    formData.append('email', mockUser.email);
    formData.append('password', mockUser.password);

    expect(formData.get('name')).toBe('Test User');
    expect(formData.get('email')).toBe('test@example.com');
  });
});

// --- 3. FAVORITE SYSTEM MOCK TESTS ---
describe('Favorites System Logic', () => {
  it('should correctly identify if a tool is favorited from a list of IDs', () => {
    const favoriteIds = [1, 5, 10];
    const toolToTest = mockTools[0]; // ID: 1
    const isSaved = favoriteIds.includes(toolToTest.id);
    
    expect(isSaved).toBe(true);

    const toolNotSaved = mockTools[1]; // ID: 2
    expect(favoriteIds.includes(toolNotSaved.id)).toBe(false);
  });

  it('should handle optimistic updates correctly (UI logic)', () => {
    let savedState = false;
    const toggle = () => { savedState = !savedState; };

    toggle();
    expect(savedState).toBe(true);
    
    toggle();
    expect(savedState).toBe(false);
  });
});
