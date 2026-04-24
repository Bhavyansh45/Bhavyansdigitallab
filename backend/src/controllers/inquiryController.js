import { q } from '../models/baseModel.js';

export const createInquiry = async (req, res) => {
  const { name, email, phone, message } = req.body;
  await q('INSERT INTO inquiries (name, email, phone, message) VALUES (?,?,?,?)', [name, email, phone, message]);
  return res.status(201).json({ message: 'Inquiry saved' });
};
