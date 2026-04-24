import { q } from '../models/baseModel.js';

export async function getActiveSettingsService() {
  const [settings] = await q('SELECT * FROM settings ORDER BY id DESC LIMIT 1');
  return settings || { company_name: 'Bhavyansh Digital Lab', email: '', phone: '', address: '', gst_number: '' };
}
