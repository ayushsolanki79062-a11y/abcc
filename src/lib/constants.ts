import { BookCategory, BookStatus } from '@/types/book';

export const BOOK_CATEGORIES: BookCategory[] = [
  'Computer Science',
  'Mathematics',
  'Engineering',
  'Physics & Sciences',
  'Literature & Fiction',
  'History & Politics',
  'Philosophy',
  'Business & Economics',
  'Medical & Life Sciences',
  'General',
];

export const STATUS_CONFIG: Record<
  BookStatus,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
  }
> = {
  Available: {
    label: 'Available',
    bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
    textClass: 'text-emerald-700 dark:text-emerald-400',
    borderClass: 'border-emerald-200 dark:border-emerald-800/60',
    dotClass: 'bg-emerald-500',
  },
  Issued: {
    label: 'Issued / Borrowed',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    textClass: 'text-amber-700 dark:text-amber-400',
    borderClass: 'border-amber-200 dark:border-amber-800/60',
    dotClass: 'bg-amber-500',
  },
  Returned: {
    label: 'Returned',
    bgClass: 'bg-slate-100 dark:bg-slate-800/60',
    textClass: 'text-slate-700 dark:text-slate-300',
    borderClass: 'border-slate-200 dark:border-slate-700',
    dotClass: 'bg-slate-400',
  },
};

