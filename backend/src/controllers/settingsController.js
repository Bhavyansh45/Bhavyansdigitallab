import { q } from '../models/baseModel.js';
import { ok } from '../utils/apiResponse.js';
import { getActiveSettingsService } from '../services/settingsService.js';

export const getSettings = async (_req, res) => ok(res, await getActiveSettingsService());
export const saveSettings = async (req, res) => {
  const { company_name, logo_url, gst_number, address, phone, email } = req.body;
  const result = await q('INSERT INTO settings (company_name, logo_url, gst_number, address, phone, email) VALUES (?,?,?,?,?,?)', [company_name, logo_url || null, gst_number || null, address || null, phone || null, email || null]);
  return ok(res, { id: result.insertId }, 'Settings saved', 201);
};
