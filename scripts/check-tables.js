const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
  console.log("Existing tables:", res.rows.map(r => r.table_name));

  // Check columns of sources or related tables
  const cols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name LIKE '%source%'");
  console.log("Source columns:", cols.rows);

  await client.end();
}

main().catch(console.error);
