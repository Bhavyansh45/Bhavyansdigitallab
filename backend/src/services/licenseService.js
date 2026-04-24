import crypto from 'crypto';
import { q } from '../models/baseModel.js';

const randomKey = () => `BDL-${crypto.randomBytes(4).toString('hex')}-${crypto.randomBytes(4).toString('hex')}`.toUpperCase();

export async function generateLicenseService(product_name, expires_at = null) {
  let key = randomKey();
  let exists = await q('SELECT id FROM licenses WHERE license_key=?', [key]);
  while (exists.length) {
    key = randomKey();
    exists = await q('SELECT id FROM licenses WHERE license_key=?', [key]);
  }
  const result = await q('INSERT INTO licenses (product_name, license_key, status, expires_at) VALUES (?,?,?,?)', [product_name, key, 'active', expires_at]);
  return { id: result.insertId, license_key: key };
}

export async function activateLicenseService(license_key, machine_id) {
  const [license] = await q('SELECT * FROM licenses WHERE license_key=?', [license_key]);
  if (!license) throw new Error('License not found');
  if (license.status === 'revoked') throw new Error('License revoked');
  if (license.expires_at && new Date(license.expires_at) < new Date()) {
    await q("UPDATE licenses SET status='expired' WHERE id=?", [license.id]);
    throw new Error('License expired');
  }
  if (license.machine_id && license.machine_id !== machine_id) throw new Error('License is already bound to another machine');
  await q("UPDATE licenses SET machine_id=?, status='active' WHERE id=?", [machine_id, license.id]);
  return { id: license.id, status: 'active', machine_id };
}

export async function markExpiredLicensesService() {
  await q("UPDATE licenses SET status='expired' WHERE expires_at IS NOT NULL AND expires_at < CURDATE() AND status <> 'revoked'");
  return { updated: true };
}
