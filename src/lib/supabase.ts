import { createClient } from '@supabase/supabase-js';

// Supabase config
const SUPABASE_URL = 'https://nufgpguitvkxctpagwwf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZmdwZ3VpdHZreGN0cGFnd3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NTA0MTIsImV4cCI6MjA1MjUyNjQxMn0.-MLSuSnfllGJrrQMEfHrQjxZoeujy6jZiHG9L9jY6Ik';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
