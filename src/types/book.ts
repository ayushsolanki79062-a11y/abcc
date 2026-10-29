export type BookStatus = 'Available' | 'Issued' | 'Returned';

export type BookCategory =
  | 'Computer Science'
  | 'Mathematics'
  | 'Engineering'
  | 'Physics & Sciences'
  | 'Literature & Fiction'
  | 'History & Politics'
  | 'Philosophy'
  | 'Business & Economics'
  | 'Medical & Life Sciences'
  | 'General';

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  isbn?: string | null;
  category: string;
  status: BookStatus;
  borrowed_date?: string | null;
  due_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export type BookFormData = {
  title: string;
  author: string;
  isbn?: string;
  category: string;
  status: BookStatus;
  borrowed_date?: string;
  due_date?: string;
  notes?: string;
};

export interface DashboardStats {
  totalBooks: number;
  borrowedBooks: number;
  returnedBooks: number;
  overdueBooks: number;
  availableBooks: number;
  upcomingDeadlines: Book[];
  monthlyBorrowingStats: {
    month: string;
    borrowed: number;
    returned: number;
  }[];
}

