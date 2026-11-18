const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project-id')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  } catch (err) {
    console.warn('Supabase client initialization failed:', err.message);
  }
} else {
  console.log('ℹ️ Supabase credentials not provided yet. Storage falling back to local storage.');
}

const bucketName = process.env.SUPABASE_BUCKET || 'admission-documents';

module.exports = {
  supabase,
  bucketName
};