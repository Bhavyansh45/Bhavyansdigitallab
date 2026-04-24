import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { upload } from '../middleware/upload.js';
import { getDashboard } from '../controllers/dashboardController.js';
import { createEstimate, deleteEstimate, duplicateEstimate, estimatePdf, listEstimates, updateEstimate, updateEstimateStatus } from '../controllers/estimateController.js';
import { convertEstimate, createInvoice, invoiceDetail, listInvoices, updatePayment } from '../controllers/invoiceController.js';
import { createTransaction, listTransactions } from '../controllers/transactionController.js';
import { createProject, listProjects } from '../controllers/projectController.js';
import { downloadDocument, listDocuments, uploadDocument } from '../controllers/documentController.js';
import { createApp, deleteApp, listApps, updateApp } from '../controllers/appController.js';
import { activateLicense, generateLicense, listLicenses, markExpired } from '../controllers/licenseController.js';
import { getSettings, saveSettings } from '../controllers/settingsController.js';
import { addTimeEntry, timeSummary } from '../controllers/timeController.js';
import { expenseCategory, incomeCategory, monthlySummary } from '../controllers/analyticsController.js';

const router = Router();
router.use(requireAuth);

router.get('/dashboard', asyncHandler(getDashboard));

router.get('/estimates', asyncHandler(listEstimates));
router.post('/estimates', [body('title').notEmpty(), body('items').isArray({ min: 1 }), validate], asyncHandler(createEstimate));
router.put('/estimates/:id', [body('title').notEmpty(), body('items').isArray({ min: 1 }), validate], asyncHandler(updateEstimate));
router.delete('/estimates/:id', asyncHandler(deleteEstimate));
router.post('/estimates/:id/duplicate', asyncHandler(duplicateEstimate));
router.patch('/estimates/:id/status', [body('status').isIn(['Draft', 'Sent', 'Approved', 'Rejected']), validate], asyncHandler(updateEstimateStatus));
router.get('/estimates/:id/pdf', asyncHandler(estimatePdf));

router.get('/invoices', asyncHandler(listInvoices));
router.get('/invoices/:id', asyncHandler(invoiceDetail));
router.post('/invoices', asyncHandler(createInvoice));
router.post('/invoices/convert-estimate', asyncHandler(convertEstimate));
router.patch('/invoices/:id/payment', asyncHandler(updatePayment));

router.get('/transactions', asyncHandler(listTransactions));
router.post('/transactions', [body('type').isIn(['income', 'expense']), body('amount').isFloat({ gt: 0 }), body('category').notEmpty(), body('txn_date').isISO8601(), validate], asyncHandler(createTransaction));
router.get('/analytics/monthly-summary', asyncHandler(monthlySummary));
router.get('/analytics/categories/income', asyncHandler(incomeCategory));
router.get('/analytics/categories/expense', asyncHandler(expenseCategory));

router.get('/projects', asyncHandler(listProjects));
router.post('/projects', [body('name').notEmpty(), validate], asyncHandler(createProject));

router.get('/documents', asyncHandler(listDocuments));
router.post('/documents/upload', upload.single('file'), asyncHandler(uploadDocument));
router.get('/documents/:id/download', asyncHandler(downloadDocument));

router.get('/apps', asyncHandler(listApps));
router.post('/apps', [body('app_name').notEmpty(), body('version_name').notEmpty(), body('download_url').isURL(), validate], asyncHandler(createApp));
router.put('/apps/:id', [body('app_name').notEmpty(), body('version_name').notEmpty(), body('download_url').isURL(), validate], asyncHandler(updateApp));
router.delete('/apps/:id', asyncHandler(deleteApp));

router.get('/licenses', asyncHandler(listLicenses));
router.post('/licenses/generate', [body('product_name').notEmpty(), validate], asyncHandler(generateLicense));
router.post('/licenses/activate', [body('license_key').notEmpty(), body('machine_id').notEmpty(), validate], asyncHandler(activateLicense));
router.post('/licenses/mark-expired', asyncHandler(markExpired));

router.get('/time-entries/summary', asyncHandler(timeSummary));
router.post('/time-entries', [body('project_id').isInt({ gt: 0 }), body('hours').isFloat({ gt: 0 }), body('entry_date').isISO8601(), validate], asyncHandler(addTimeEntry));

router.get('/settings', asyncHandler(getSettings));
router.post('/settings', asyncHandler(saveSettings));

export default router;
