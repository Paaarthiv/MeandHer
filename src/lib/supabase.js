import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the client if the URL appears valid to prevent runtime crashes
// when env variables are not yet set.
const isValidUrl = (url) => url && url.startsWith('http');

export const supabase = isValidUrl(supabaseUrl)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

if (!supabase) {
    console.warn('Supabase is not initialized. Check your .env setup.');
}
