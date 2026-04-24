import { pool } from '../config/db.js';

export async function q(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
