import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // penting untuk Neon di Vercel
  },
});

export type { QueryResultRow } from "pg";
