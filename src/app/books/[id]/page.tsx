import React, { Suspense } from 'react';
import { BookDetailView } from './BookDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function BookDetailContent({ params }: PageProps) {
  const { id } = await params;
  return <BookDetailView id={id} />;
}

function BookDetailSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-64 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export default function BookDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<BookDetailSkeleton />}>
      <BookDetailContent params={params} />
    </Suspense>
  );
}
