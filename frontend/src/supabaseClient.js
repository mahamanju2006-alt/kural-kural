import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tzhagdjgesandkocdiem.supabase.co';
const supabaseAnonKey = 'sb_publishable_Lr5dGV69eRMTxZmdjMfWow_XsE_bFdf';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
