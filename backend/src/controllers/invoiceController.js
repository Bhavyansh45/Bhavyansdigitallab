import { q } from '../models/baseModel.js';
import { ok } from '../utils/apiResponse.js';
import { addManualInvoiceService, convertEstimateToInvoiceService, invoiceDetailService, updatePaymentService } from '../services/invoiceService.js';

export const listInvoices = async (_req, res) => ok(res, await q('SELECT * FROM invoices ORDER BY id DESC'));
export const createInvoice = async (req, res) => ok(res, await addManualInvoiceService(req.body), 'Invoice created', 201);
export const convertEstimate = async (req, res) => ok(res, await convertEstimateToInvoiceService(req.body.estimate_id, req.body.gst_percent || 0), 'Invoice generated from estimate', 201);
export const updatePayment = async (req, res) => ok(res, await updatePaymentService(req.params.id, req.body.paid_amount), 'Payment updated');
export const invoiceDetail = async (req, res) => ok(res, await invoiceDetailService(req.params.id));
