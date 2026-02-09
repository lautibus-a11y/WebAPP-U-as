
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oixzrzuxbafgxdvvxqqm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peHpyenV4YmFmZ3hkdnZ4cXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MDI4OTQsImV4cCI6MjA4NjA3ODg5NH0.afXL-A13PtihoCgsXJBVH6Yee2xy8TWUWVkWSjgK-dY';

// Instancia única del cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
