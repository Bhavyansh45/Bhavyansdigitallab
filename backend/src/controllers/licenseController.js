import { q } from '../models/baseModel.js';
import { ok } from '../utils/apiResponse.js';
import { activateLicenseService, generateLicenseService, markExpiredLicensesService } from '../services/licenseService.js';

export const listLicenses = async (_req, res) => ok(res, await q('SELECT * FROM licenses ORDER BY id DESC'));
export const generateLicense = async (req, res) => ok(res, await generateLicenseService(req.body.product_name, req.body.expires_at), 'License generated', 201);
export const activateLicense = async (req, res) => ok(res, await activateLicenseService(req.body.license_key, req.body.machine_id), 'License activated');
export const markExpired = async (_req, res) => ok(res, await markExpiredLicensesService(), 'Expired licenses updated');
