import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../models/authModel.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const users = await findUserByEmail(email);
  const user = users[0];
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1d' });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
};
