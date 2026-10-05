const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlMatch = envContent.match(/DATABASE_URL=([^\r\n]+)/);
const databaseUrl = dbUrlMatch ? dbUrlMatch[1].trim() : null;

const client = new Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('Connected to PostgreSQL.');

  // 1. Backup current records to a local file before wiping
  const backupDir = path.resolve(__dirname, '../backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const devices = await client.query('SELECT * FROM devices');
  const policies = await client.query('SELECT * FROM parental_policies');
  const schedules = await client.query('SELECT * FROM time_schedules');

  const backupData = {
    timestamp: new Date().toISOString(),
    devices: devices.rows,
    parental_policies: policies.rows,
    time_schedules: schedules.rows,
  };

  const backupFile = path.join(backupDir, `activation_backup_${Date.now()}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8');
  console.log(`Backup saved to ${backupFile}`);

  // 2. Perform deletion
  console.log('Deleting records from time_schedules...');
  const delSchedules = await client.query('DELETE FROM time_schedules');
  console.log(`Deleted ${delSchedules.rowCount} rows from time_schedules.`);

  console.log('Deleting records from parental_policies...');
  const delPolicies = await client.query('DELETE FROM parental_policies');
  console.log(`Deleted ${delPolicies.rowCount} rows from parental_policies.`);

  console.log('Deleting records from devices...');
  const delDevices = await client.query('DELETE FROM devices');
  console.log(`Deleted ${delDevices.rowCount} rows from devices.`);

  // 3. Verify counts
  const countDev = await client.query('SELECT COUNT(*) FROM devices');
  const countPol = await client.query('SELECT COUNT(*) FROM parental_policies');
  const countSch = await client.query('SELECT COUNT(*) FROM time_schedules');

  console.log('--- VERIFICATION ---');
  console.log(`devices count: ${countDev.rows[0].count}`);
  console.log(`parental_policies count: ${countPol.rows[0].count}`);
  console.log(`time_schedules count: ${countSch.rows[0].count}`);

  await client.end();
}

run().catch(err => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});
