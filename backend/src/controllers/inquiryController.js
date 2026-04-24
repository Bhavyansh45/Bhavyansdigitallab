import { q } from '../models/baseModel.js';
import { ok } from '../utils/apiResponse.js';

export const createInquiry = async (req, res) => {
  const { name, email, phone, message } = req.body;
  const result = await q('INSERT INTO inquiries (name, email, phone, message) VALUES (?,?,?,?)', [name, email, phone || null, message]);
  return ok(res, { id: result.insertId }, 'Inquiry saved', 201);
};
