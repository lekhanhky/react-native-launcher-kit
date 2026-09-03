const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Lekhanhky@123@db.jlfemayqttjcfjualfsv.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to PostgreSQL database jlfemayqttjcfjualfsv!');

  // 1. Sinh đề cho Lớp 2 & Lớp 3
  await client.query(`
    SELECT generate_math_batch_questions('a3333333-3333-3333-3333-333333333333', 'grade2', 'MULTIPLICATION', 20);
    SELECT generate_math_batch_questions('a4444444-4444-4444-4444-444444444444', 'grade3', 'MULTIPLICATION', 20);
    NOTIFY pgrst, 'reload schema';
  `);
  console.log('✅ Đã sinh thêm 20 câu hỏi cho Lớp 2 và 20 câu hỏi cho Lớp 3!');

  await client.end();
}

run().catch(console.error);
