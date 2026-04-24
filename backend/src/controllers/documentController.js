import fs from 'fs';
import { q } from '../models/baseModel.js';
import { ok } from '../utils/apiResponse.js';
import { resolveUploadPath } from '../middleware/upload.js';

export const uploadDocument = async (req, res) => {
  const { title, tags, project_id } = req.body;
  const file = req.file;
  if (!file) throw new Error('File is required');
  const result = await q('INSERT INTO documents (title, file_url, tags, project_id) VALUES (?,?,?,?)', [title || file.originalname, file.filename, tags || null, project_id || null]);
  return ok(res, { id: result.insertId }, 'Document uploaded', 201);
};

export const listDocuments = async (_req, res) => ok(res, await q('SELECT * FROM documents ORDER BY id DESC'));

export const downloadDocument = async (req, res) => {
  const [doc] = await q('SELECT * FROM documents WHERE id=?', [req.params.id]);
  if (!doc) throw new Error('Document not found');
  const path = resolveUploadPath(doc.file_url);
  if (!fs.existsSync(path)) throw new Error('File not found on server');
  return res.download(path);
};
