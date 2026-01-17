
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
    public: {
        Tables: {
            leads: {
                Row: {
                    id: string;
                    name: string;
                    email: string;
                    phone: string;
                    company: string;
                    message: string;
                    interest_area: string | null;
                    project_id: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    email: string;
                    phone: string;
                    company: string;
                    message: string;
                    interest_area?: string | null;
                    project_id?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    email?: string;
                    phone?: string;
                    company?: string;
                    message?: string;
                    interest_area?: string | null;
                    project_id?: string | null;
                    created_at?: string;
                };
            };
            projects: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    description: string;
                    schema: any;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    description: string;
                    schema: any;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    description?: string;
                    schema?: any;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}

// Helper functions
export const createLead = async (leadData: Database['public']['Tables']['leads']['Insert']) => {
    const { data, error } = await supabase
        .from('leads')
        .insert(leadData)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const createProject = async (projectData: Database['public']['Tables']['projects']['Insert']) => {
    const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getUserProjects = async (userId: string) => {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const updateProject = async (
    projectId: string,
    updates: Database['public']['Tables']['projects']['Update']
) => {
    const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .select()
        .single();

    if (error) throw error;
    return data;
};
