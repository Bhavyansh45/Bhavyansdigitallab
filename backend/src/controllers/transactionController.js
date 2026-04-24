import { q } from '../models/baseModel.js';
import { ok } from '../utils/apiResponse.js';

export const listTransactions = async (_req, res) => ok(res, await q('SELECT * FROM transactions ORDER BY txn_date DESC, id DESC'));
export const createTransaction = async (req, res) => {
  const { type, category, description, amount, txn_date } = req.body;
  const result = await q('INSERT INTO transactions (type, category, description, amount, txn_date) VALUES (?,?,?,?,?)', [type, category, description || null, amount, txn_date]);
  return ok(res, { id: result.insertId }, 'Transaction created', 201);
};
