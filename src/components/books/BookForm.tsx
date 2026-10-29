'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book, BookFormData, BookStatus } from '@/types/book';
import { BOOK_CATEGORIES } from '@/lib/constants';
import { createBookRecord, updateBookRecord } from '@/lib/books';
import { formatDateForInput } from '@/lib/utils';
import { BookOpen, Calendar, Check, AlertCircle, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BookFormProps {
  initialData?: Book | null;
  isEditing?: boolean;
  onSuccess?: (book: Book) => void;
}

export function BookForm({ initialData, isEditing = false, onSuccess }: BookFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<BookFormData>({
    title: initialData?.title || '',
    author: initialData?.author || '',
    isbn: initialData?.isbn || '',
    category: initialData?.category || 'Computer Science',
    status: (initialData?.status as BookStatus) || 'Available',
    borrowed_date: formatDateForInput(initialData?.borrowed_date),
    due_date: formatDateForInput(initialData?.due_date),
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) {
      errs.title = 'Book title is required.';
    }
    if (!formData.author.trim()) {
      errs.author = 'Author name is required.';
    }
    if (formData.status === 'Issued' && !formData.due_date) {
      errs.due_date = 'Please set an expected due date for issued books.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      if (isEditing && initialData) {
        const { book, error } = await updateBookRecord(initialData.id, formData);
        if (error) {
          setServerError(error);
        } else if (book) {
          setSuccessMessage('Book record updated successfully!');
          if (onSuccess) {
            onSuccess(book);
          } else {
            router.push(`/books/${book.id}`);
            router.refresh();
          }
        }
      } else {
        const { book, error } = await createBookRecord(formData);
        if (error) {
          setServerError(error);
        } else if (book) {
          setSuccessMessage('Book added to library catalog successfully!');
          if (onSuccess) {
            onSuccess(book);
          } else {
            router.push(`/books/${book.id}`);
            router.refresh();
          }
        }
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = (status: BookStatus) => {
    setFormData((prev) => {
      const updated = { ...prev, status };
      const today = new Date().toISOString().split('T')[0];

      if (status === 'Issued') {
        if (!updated.borrowed_date) updated.borrowed_date = today;
        if (!updated.due_date) {
          // Default due date to 14 days from today
          const d = new Date();
          d.setDate(d.getDate() + 14);
          updated.due_date = d.toISOString().split('T')[0];
        }
      } else if (status === 'Available') {
        updated.borrowed_date = '';
        updated.due_date = '';
      }
      return updated;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Messages */}
      {serverError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <div>
            <span className="font-semibold">Unable to save book:</span> {serverError}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-start gap-2.5">
          <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <div className="font-semibold">{successMessage}</div>
        </div>
      )}

      {/* Main Metadata Section */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <h3 className="font-serif text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-zinc-500" />
          Book Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Book Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Structure and Interpretation of Computer Programs"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none dark:bg-zinc-800/80 dark:text-zinc-100 ${
                errors.title
                  ? 'border-rose-300 focus:border-rose-500 bg-rose-50/30'
                  : 'border-zinc-200 focus:border-slate-800 dark:border-zinc-700 dark:focus:border-zinc-400'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Author(s) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Harold Abelson, Gerald Jay Sussman"
              value={formData.author}
              onChange={(e) => {
                setFormData({ ...formData, author: e.target.value });
                if (errors.author) setErrors({ ...errors, author: '' });
              }}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none dark:bg-zinc-800/80 dark:text-zinc-100 ${
                errors.author
                  ? 'border-rose-300 focus:border-rose-500 bg-rose-50/30'
                  : 'border-zinc-200 focus:border-slate-800 dark:border-zinc-700 dark:focus:border-zinc-400'
              }`}
            />
            {errors.author && <p className="mt-1 text-xs text-rose-600">{errors.author}</p>}
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              ISBN (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 978-0262510875"
              value={formData.isbn || ''}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-slate-800 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:border-zinc-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Category / Subject <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:border-zinc-400"
            >
              {BOOK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Inventory Status <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleStatusChange(e.target.value as BookStatus)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:border-zinc-400"
            >
              <option value="Available">Available</option>
              <option value="Issued">Issued / Borrowed</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Circulation / Borrowing Timeline */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <h3 className="font-serif text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-zinc-500" />
          Circulation & Schedule
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Borrowed Date */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Issue / Borrowed Date
            </label>
            <input
              type="date"
              value={formData.borrowed_date || ''}
              onChange={(e) => setFormData({ ...formData, borrowed_date: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-slate-800 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:border-zinc-400"
            />
            <p className="mt-1 text-[11px] text-zinc-400">Date the book was taken out.</p>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Return Due Date {formData.status === 'Issued' && <span className="text-rose-500">*</span>}
            </label>
            <input
              type="date"
              value={formData.due_date || ''}
              onChange={(e) => {
                setFormData({ ...formData, due_date: e.target.value });
                if (errors.due_date) setErrors({ ...errors, due_date: '' });
              }}
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none dark:bg-zinc-800/80 dark:text-zinc-100 ${
                errors.due_date
                  ? 'border-rose-300 focus:border-rose-500 bg-rose-50/30'
                  : 'border-zinc-200 focus:border-slate-800 dark:border-zinc-700 dark:focus:border-zinc-400'
              }`}
            />
            {errors.due_date ? (
              <p className="mt-1 text-xs text-rose-600">{errors.due_date}</p>
            ) : (
              <p className="mt-1 text-[11px] text-zinc-400">Return deadline for the borrower.</p>
            )}
          </div>

          {/* Notes / Shelf Location */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Notes & Shelf Location (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Shelf B-4, 2nd Floor Science Section; Borrowed by Prof. Davis for CS101 seminar."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-slate-800 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-100 dark:focus:border-zinc-400"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href={isEditing && initialData ? `/books/${initialData.id}` : '/books'}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel & Return
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
        >
          <Save className="h-4 w-4" />
          {submitting ? 'Saving to Database...' : isEditing ? 'Update Book Record' : 'Add Book to Catalog'}
        </button>
      </div>
    </form>
  );
}

