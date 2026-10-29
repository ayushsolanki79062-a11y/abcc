import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { Book, BookFormData, BookStatus, DashboardStats } from '@/types/book';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

export interface BookFilterParams {
  search?: string;
  status?: BookStatus | 'All';
  category?: string;
  sortBy?: 'dueDate' | 'title' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export async function fetchBooks(
  params: BookFilterParams = {},
  client?: SupabaseClient<Database>
): Promise<{ books: Book[]; error: string | null }> {
  try {
    const supabase = client || createBrowserClient();
    let query = supabase.from('books').select('*');

    // 1. Filter by status
    if (params.status && params.status !== 'All') {
      query = query.eq('status', params.status);
    }

    // 2. Filter by category
    if (params.category && params.category !== 'All') {
      query = query.eq('category', params.category);
    }

    // 3. Search by title, author, or isbn
    if (params.search && params.search.trim()) {
      const term = params.search.trim();
      // Supabase ilike or full text search
      query = query.or(`title.ilike.%${term}%,author.ilike.%${term}%,isbn.ilike.%${term}%`);
    }

    // 4. Sorting
    if (params.sortBy === 'dueDate') {
      // Closest deadline first (nulls last)
      query = query.order('due_date', { ascending: params.sortOrder !== 'desc', nullsFirst: false });
    } else if (params.sortBy === 'title') {
      query = query.order('title', { ascending: params.sortOrder !== 'desc' });
    } else {
      // Default: createdAt desc
      query = query.order('created_at', { ascending: params.sortOrder === 'asc' });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching books:', error);
      return { books: [], error: error.message };
    }

    return { books: (data as Book[]) || [], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { books: [], error: message };
  }
}

export async function fetchBookById(
  id: string,
  client?: SupabaseClient<Database>
): Promise<{ book: Book | null; error: string | null }> {
  try {
    const supabase = client || createBrowserClient();
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { book: null, error: error.message };
    }

    return { book: data as Book, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { book: null, error: message };
  }
}

export async function createBookRecord(
  formData: BookFormData,
  client?: SupabaseClient<Database>
): Promise<{ book: Book | null; error: string | null }> {
  try {
    const supabase = client || createBrowserClient();
    
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { book: null, error: 'User is not authenticated. Please log in.' };
    }

    const insertPayload = {
      user_id: user.id,
      title: formData.title.trim(),
      author: formData.author.trim(),
      isbn: formData.isbn?.trim() || null,
      category: formData.category || 'General',
      status: formData.status,
      borrowed_date: formData.borrowed_date ? new Date(formData.borrowed_date).toISOString() : null,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      notes: formData.notes?.trim() || null,
    };

    const { data, error } = await supabase
      .from('books')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      return { book: null, error: error.message };
    }

    return { book: data as Book, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { book: null, error: message };
  }
}

export async function updateBookRecord(
  id: string,
  formData: Partial<BookFormData>,
  client?: SupabaseClient<Database>
): Promise<{ book: Book | null; error: string | null }> {
  try {
    const supabase = client || createBrowserClient();

    const updatePayload: Database['public']['Tables']['books']['Update'] = {};
    if (formData.title !== undefined) updatePayload.title = formData.title.trim();
    if (formData.author !== undefined) updatePayload.author = formData.author.trim();
    if (formData.isbn !== undefined) updatePayload.isbn = formData.isbn.trim() || null;
    if (formData.category !== undefined) updatePayload.category = formData.category;
    if (formData.status !== undefined) updatePayload.status = formData.status;
    if (formData.borrowed_date !== undefined) {
      updatePayload.borrowed_date = formData.borrowed_date ? new Date(formData.borrowed_date).toISOString() : null;
    }
    if (formData.due_date !== undefined) {
      updatePayload.due_date = formData.due_date ? new Date(formData.due_date).toISOString() : null;
    }
    if (formData.notes !== undefined) updatePayload.notes = formData.notes.trim() || null;

    const { data, error } = await supabase
      .from('books')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { book: null, error: error.message };
    }

    return { book: data as Book, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { book: null, error: message };
  }
}

export async function deleteBookRecord(
  id: string,
  client?: SupabaseClient<Database>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = client || createBrowserClient();
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}

export async function fetchDashboardStats(
  client?: SupabaseClient<Database>
): Promise<{ stats: DashboardStats; error: string | null }> {
  const defaultStats: DashboardStats = {
    totalBooks: 0,
    borrowedBooks: 0,
    returnedBooks: 0,
    overdueBooks: 0,
    availableBooks: 0,
    upcomingDeadlines: [],
    monthlyBorrowingStats: [],
  };

  try {
    const supabase = client || createBrowserClient();
    const { data: books, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { stats: defaultStats, error: error.message };
    }

    const allBooks = (books as Book[]) || [];
    const now = new Date();

    const totalBooks = allBooks.length;
    let borrowedBooks = 0;
    let returnedBooks = 0;
    let overdueBooks = 0;
    let availableBooks = 0;
    const upcomingDeadlines: Book[] = [];

    // Monthly breakdown for the last 6 months
    const monthlyMap = new Map<string, { borrowed: number; returned: number }>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short' });
      monthlyMap.set(key, { borrowed: 0, returned: 0 });
    }

    for (const b of allBooks) {
      if (b.status === 'Issued') {
        borrowedBooks++;
        if (b.due_date) {
          const dueDate = new Date(b.due_date);
          if (dueDate < now) {
            overdueBooks++;
          } else {
            upcomingDeadlines.push(b);
          }
        }
      } else if (b.status === 'Returned') {
        returnedBooks++;
      } else if (b.status === 'Available') {
        availableBooks++;
      }

      // Check monthly activity
      if (b.borrowed_date) {
        const bd = new Date(b.borrowed_date);
        const key = bd.toLocaleString('default', { month: 'short' });
        if (monthlyMap.has(key)) {
          const entry = monthlyMap.get(key)!;
          entry.borrowed++;
        }
      }
      if (b.status === 'Returned' && b.updated_at) {
        const rd = new Date(b.updated_at);
        const key = rd.toLocaleString('default', { month: 'short' });
        if (monthlyMap.has(key)) {
          const entry = monthlyMap.get(key)!;
          entry.returned++;
        }
      }
    }

    // Sort upcoming deadlines by closest date
    upcomingDeadlines.sort((a, b) => {
      const dateA = a.due_date ? new Date(a.due_date).getTime() : Infinity;
      const dateB = b.due_date ? new Date(b.due_date).getTime() : Infinity;
      return dateA - dateB;
    });

    const monthlyBorrowingStats = Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      borrowed: data.borrowed,
      returned: data.returned,
    }));

    return {
      stats: {
        totalBooks,
        borrowedBooks,
        returnedBooks,
        overdueBooks,
        availableBooks,
        upcomingDeadlines: upcomingDeadlines.slice(0, 5), // top 5 upcoming
        monthlyBorrowingStats,
      },
      error: null,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { stats: defaultStats, error: message };
  }
}

