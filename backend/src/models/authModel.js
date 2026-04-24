import { q } from './baseModel.js';

export const findUserByEmail = (email) => q('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
