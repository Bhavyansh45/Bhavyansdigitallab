import { q } from '../models/baseModel.js';

export const listByTable = (table) => async (_req, res) => {
  const rows = await q(`SELECT * FROM ${table} ORDER BY id DESC`);
  return res.json(rows);
};

export const createByTable = (table, fields) => async (req, res) => {
  const values = fields.map((f) => req.body[f] ?? null);
  const placeholders = fields.map(() => '?').join(',');
  const sql = `INSERT INTO ${table} (${fields.join(',')}) VALUES (${placeholders})`;
  const result = await q(sql, values);
  return res.status(201).json({ id: result.insertId });
};
