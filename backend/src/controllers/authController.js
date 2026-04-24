import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail } from '../models/authModel.js';
import { ok, fail } from '../utils/apiResponse.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const users = await findUserByEmail(email);
  const user = users[0];
  if (!user) return fail(res, 'Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return fail(res, 'Invalid credentials', 401);

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '1d' });
  return ok(res, { token, user: { id: user.id, name: user.name, email: user.email } }, 'Login successful');
};
