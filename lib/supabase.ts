import { createClient } from '@supabase/supabase-js';

// --- Environment Variable Resolution ---
// Supports Vite, Next.js, and standard process.env
const getEnv = (key: string) => {
    // Check for Vite
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[`VITE_${key}`]) {
        // @ts-ignore
        return import.meta.env[`VITE_${key}`];
    }
    
    // Check for process.env (Node/CRA/Next)
    // IMPORTANT: Check typeof process first to avoid ReferenceError in pure browsers
    if (typeof process !== 'undefined' && process.env) {
        // @ts-ignore
        return process.env[`NEXT_PUBLIC_${key}`] || process.env[`REACT_APP_${key}`] || process.env[key];
    }
    
    return '';
};

const SUPABASE_URL = getEnv('SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY');

// --- Mock Client (Offline / Demo Mode) ---
const MOCK_USER_STORAGE_KEY = 'kidboost_mock_user';

export const mockSupabase = {
  auth: {
    signInWithOtp: async ({ email }: { email: string }) => {
      console.log(`[MockAuth] OTP sent to ${email} (Use 123456)`);
      return { error: null };
    },
    verifyOtp: async ({ email, token, type }: { email: string, token: string, type: string }) => {
      if (token === '123456') {
        const user = {
          id: 'user_123',
          email: email,
          pin: '1234', // Default PIN
          children: []
        };
        // Persist mock session
        localStorage.setItem(MOCK_USER_STORAGE_KEY, JSON.stringify(user));
        return { data: { user }, error: null };
      }
      return { data: { user: null }, error: { message: 'Invalid OTP' } };
    },
    signOut: async () => {
      localStorage.removeItem(MOCK_USER_STORAGE_KEY);
      return { error: null };
    },
    getSession: async () => {
        const stored = localStorage.getItem(MOCK_USER_STORAGE_KEY);
        if (stored) {
            return { data: { session: { user: JSON.parse(stored) } }, error: null };
        }
        return { data: { session: null }, error: null };
    }
  },
  from: (table: string) => ({
      select: (query: string) => ({
          eq: (col: string, val: any) => ({
             gt: (col2: string, val2: any) => Promise.resolve({ data: [], error: null }), // Mock empty updates
             data: [], error: null
          }),
          order: () => Promise.resolve({ data: [], error: null })
      }),
      upsert: (data: any, config: any) => {
          console.log(`[MockDB] Upsert to ${table}:`, data);
          return Promise.resolve({ error: null });
      }
  }),
  storage: {
      from: (bucket: string) => ({
          upload: async (path: string, file: Blob) => {
              console.log(`[MockStorage] Uploaded ${file.size} bytes to ${bucket}/${path}`);
              await new Promise(r => setTimeout(r, 1000)); // Simulate delay
              return { data: { path: `mock/${path}` }, error: null };
          },
          getPublicUrl: (path: string) => {
              return { data: { publicUrl: 'https://via.placeholder.com/300' } };
          }
      })
  }
};

// --- Export Client ---
// Use real client if keys are present, otherwise fallback to mock
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : mockSupabase as any;

// Helper for photo uploads
export const uploadPhoto = async (childId: string, blob: Blob) => {
    const filename = `${childId}/${Date.now()}.jpg`;
    const { data, error } = await supabase.storage.from('kidboost-photos').upload(filename, blob);
    if (error) throw error;
    return data?.path;
};