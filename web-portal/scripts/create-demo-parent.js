const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=([^\r\n]+)/);
const databaseUrl = dbUrlMatch ? dbUrlMatch[1].trim() : null;

const anonKeyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=([^\r\n]+)/);
const anonKey = anonKeyMatch ? anonKeyMatch[1].trim() : null;

const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=([^\r\n]+)/);
const supabaseUrl = supabaseUrlMatch ? supabaseUrlMatch[1].trim() : null;

const client = new Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

const DEMO_EMAIL = 'parent@demo.com';
const DEMO_PASSWORD = 'password123';

async function run() {
  await client.connect();
  console.log('Connected to PostgreSQL.');

  // Check if pgcrypto is in extensions or public
  const pgcryptoRes = await client.query(
    "SELECT extname, extnamespace::regnamespace::text FROM pg_extension WHERE extname = 'pgcrypto'"
  );
  console.log('pgcrypto schema:', pgcryptoRes.rows);

  const pgcryptoSchema = pgcryptoRes.rows.length > 0 ? pgcryptoRes.rows[0].extnamespace : 'public';
  console.log(`Using pgcrypto schema: ${pgcryptoSchema}`);

  // Delete existing demo user if exists to recreate cleanly
  await client.query("DELETE FROM auth.users WHERE email = $1", [DEMO_EMAIL]);
  console.log(`Removed previous ${DEMO_EMAIL} if any.`);

  // Insert new confirmed user
  const insertSql = `
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      phone_change,
      phone_change_token,
      email_change_token_current,
      reauthentication_token,
      is_sso_user,
      is_anonymous
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      $1,
      ${pgcryptoSchema}.crypt($2, ${pgcryptoSchema}.gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Phụ Huynh Demo","role":"parent"}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      false,
      false
    ) RETURNING id, email, email_confirmed_at;
  `;

  const insertRes = await client.query(insertSql, [DEMO_EMAIL, DEMO_PASSWORD]);
  console.log('Created user:', insertRes.rows[0]);

  await client.end();

  // Test sign in via Supabase client with anon key
  console.log('Testing Supabase login with credentials...');
  const supabase = createClient(supabaseUrl, anonKey);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });

  if (error) {
    console.error('Sign in test failed:', error);
    process.exit(1);
  }

  console.log('SUCCESS! Authenticated session created:');
  console.log('User ID:', data.user.id);
  console.log('Email:', data.user.email);
  console.log('Access token expires in:', data.session.expires_in, 'seconds');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
