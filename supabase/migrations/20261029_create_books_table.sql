-- LibFlow Database Migration: Books Table & Row Level Security (RLS)

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Issued', 'Returned')),
    borrowed_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_user_id ON public.books(user_id);
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category);
CREATE INDEX IF NOT EXISTS idx_books_due_date ON public.books(due_date);

-- 3. Trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_books_updated_at ON public.books;
CREATE TRIGGER set_books_updated_at
    BEFORE UPDATE ON public.books
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Policy: Users can view only their own books
CREATE POLICY "Users can view own books"
    ON public.books
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own books
CREATE POLICY "Users can insert own books"
    ON public.books
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own books
CREATE POLICY "Users can update own books"
    ON public.books
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own books
CREATE POLICY "Users can delete own books"
    ON public.books
    FOR DELETE
    USING (auth.uid() = user_id);

