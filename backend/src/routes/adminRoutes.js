import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getDashboard } from '../controllers/dashboardController.js';
import { createEstimate, estimatePdf } from '../controllers/estimateController.js';
import { createByTable, listByTable } from '../controllers/genericControllerFactory.js';

const router = Router();
router.use(requireAuth);

router.get('/dashboard', getDashboard);
router.post('/estimates', createEstimate);
router.get('/estimates', listByTable('estimates'));
router.get('/estimates/:id/pdf', estimatePdf);

router.get('/invoices', listByTable('invoices'));
router.post('/invoices', createByTable('invoices', ['client_id', 'estimate_id', 'invoice_number', 'total_amount', 'gst_percent', 'payment_status', 'payment_mode']));

router.get('/transactions', listByTable('transactions'));
router.post('/transactions', createByTable('transactions', ['type', 'category', 'description', 'amount', 'txn_date']));

router.get('/projects', listByTable('projects'));
router.post('/projects', createByTable('projects', ['name', 'status', 'deadline', 'budget']));

router.get('/documents', listByTable('documents'));
router.post('/documents', createByTable('documents', ['title', 'file_url', 'tags', 'project_id']));

router.get('/apps', listByTable('apps'));
router.post('/apps', createByTable('apps', ['app_name', 'version_name', 'description', 'download_url', 'release_notes']));

router.get('/licenses', listByTable('licenses'));
router.post('/licenses', createByTable('licenses', ['product_name', 'license_key', 'machine_id', 'status', 'expires_at']));

router.get('/settings', listByTable('settings'));
router.post('/settings', createByTable('settings', ['company_name', 'logo_url', 'gst_number', 'address', 'phone', 'email']));

export default router;
