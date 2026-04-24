import { q } from '../models/baseModel.js';
import { ok } from '../utils/apiResponse.js';

export const listProjects = async (_req, res) => ok(res, await q('SELECT * FROM projects ORDER BY id DESC'));
export const createProject = async (req, res) => {
  const { name, status, deadline, budget } = req.body;
  const result = await q('INSERT INTO projects (name, status, deadline, budget) VALUES (?,?,?,?)', [name, status || 'Idea', deadline || null, budget || 0]);
  return ok(res, { id: result.insertId }, 'Project created', 201);
};
