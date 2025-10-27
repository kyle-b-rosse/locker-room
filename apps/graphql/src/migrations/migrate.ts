import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log('Running database migrations...');
    
    const sql = readFileSync(
      join(__dirname, 'init.sql'),
      'utf-8'
    );
    
    await pool.query(sql);
    
    console.log('✅ Database migrations completed successfully');
    await pool.end();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

migrate();

