import { q } from '../models/baseModel.js';
import { ok } from '../utils/apiResponse.js';

export const listApps = async (_req, res) => ok(res, await q('SELECT * FROM apps ORDER BY id DESC'));

export const createApp = async (req, res) => {
  const { app_name, version_name, description, download_url, release_notes } = req.body;
  const result = await q('INSERT INTO apps (app_name, version_name, description, download_url, release_notes) VALUES (?,?,?,?,?)', [app_name, version_name, description || null, download_url, release_notes || null]);
  return ok(res, { id: result.insertId }, 'App version created', 201);
};

export const updateApp = async (req, res) => {
  const { app_name, version_name, description, download_url, release_notes } = req.body;
  await q('UPDATE apps SET app_name=?, version_name=?, description=?, download_url=?, release_notes=? WHERE id=?', [app_name, version_name, description || null, download_url, release_notes || null, req.params.id]);
  return ok(res, { id: req.params.id }, 'App version updated');
};

export const deleteApp = async (req, res) => {
  await q('DELETE FROM apps WHERE id=?', [req.params.id]);
  return ok(res, { id: req.params.id }, 'App version deleted');
};
