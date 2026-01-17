-- Apricodi AI Builder - Supabase Database Schema
-- This file contains the SQL commands to create the necessary tables for the application

-- ============================================
-- LEADS TABLE
-- ============================================
-- Stores contact form submissions and sales inquiries

CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT NOT NULL,
    message TEXT NOT NULL,
    interest_area TEXT,
    project_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_interest_area ON public.leads(interest_area);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert" ON public.leads;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.leads;

-- Create policy to allow insert for everyone (for contact forms)
CREATE POLICY "Allow public insert" ON public.leads
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow select only for authenticated users
CREATE POLICY "Allow authenticated select" ON public.leads
    FOR SELECT
    USING (true);

-- ============================================
-- PROJECTS TABLE
-- ============================================
-- Stores user-created application projects

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    schema JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraint to auth.users
-- Note: This references the auth schema's users table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'projects_user_id_fkey'
    ) THEN
        ALTER TABLE public.projects 
        ADD CONSTRAINT projects_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES auth.users(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;

-- Create policy to allow users to see only their own projects
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own projects
CREATE POLICY "Users can insert own projects" ON public.projects
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own projects
CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own projects
CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTION: Update updated_at timestamp
-- ============================================
-- Automatically update the updated_at column when a project is modified

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_updated_at ON public.projects;

-- Create trigger for projects table
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT ALL ON public.leads TO anon, authenticated;
GRANT ALL ON public.projects TO authenticated;

-- Grant permissions on sequences (for auto-incrementing IDs if needed)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the setup

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS policies
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check indexes
-- SELECT * FROM pg_indexes WHERE schemaname = 'public';

-- ============================================
-- NOTES
-- ============================================
-- 1. Run this script in your Supabase SQL Editor
-- 2. Make sure to enable Row Level Security (RLS) in your Supabase project settings
-- 3. The 'anon' role is for unauthenticated users (contact forms)
-- 4. The 'authenticated' role is for logged-in users
-- 5. User metadata (name, company) is stored in auth.users metadata field
-- 6. Foreign key constraint safely handles auth.users reference
