import { q } from '../models/baseModel.js';

export async function convertEstimateToInvoiceService(estimateId, gstPercent = 0) {
  const [estimate] = await q('SELECT * FROM estimates WHERE id=?', [estimateId]);
  if (!estimate) throw new Error('Estimate not found');

  const items = await q('SELECT item_name, qty, unit_price, total_price FROM estimate_items WHERE estimate_id=?', [estimateId]);
  if (!items.length) throw new Error('Estimate has no items');

  const subtotal = items.reduce((s, i) => s + Number(i.total_price), 0);
  const gst = subtotal * (Number(gstPercent) / 100);
  const total = subtotal + gst;
  const invoiceNumber = `INV-${Date.now()}`;

  const result = await q(
    'INSERT INTO invoices (client_id, estimate_id, invoice_number, total_amount, gst_percent, payment_status, payment_mode) VALUES (?,?,?,?,?,?,?)',
    [estimate.client_id || null, estimateId, invoiceNumber, total, gstPercent, 'Unpaid', 'UPI']
  );

  for (const i of items) {
    await q('INSERT INTO invoice_items (invoice_id, item_name, qty, unit_price, total_price) VALUES (?,?,?,?,?)', [result.insertId, i.item_name, i.qty, i.unit_price, i.total_price]);
  }

  return { id: result.insertId, subtotal, gst, total, invoiceNumber };
}

export async function addManualInvoiceService(payload) {
  const total = Number(payload.total_amount || 0);
  const paid = Number(payload.paid_amount || 0);
  const paymentStatus = paid >= total ? 'Paid' : 'Unpaid';

  const result = await q(
    'INSERT INTO invoices (client_id, estimate_id, invoice_number, total_amount, gst_percent, payment_status, payment_mode, paid_amount) VALUES (?,?,?,?,?,?,?,?,?)',
    [payload.client_id || null, payload.estimate_id || null, payload.invoice_number || `INV-${Date.now()}`, total, payload.gst_percent || 0, paymentStatus, payload.payment_mode || 'UPI', paid]
  );
  return { id: result.insertId };
}

export async function updatePaymentService(id, paidAmount) {
  const [invoice] = await q('SELECT total_amount FROM invoices WHERE id=?', [id]);
  if (!invoice) throw new Error('Invoice not found');
  const status = Number(paidAmount) >= Number(invoice.total_amount) ? 'Paid' : 'Unpaid';
  await q('UPDATE invoices SET paid_amount=?, payment_status=? WHERE id=?', [paidAmount, status, id]);
  return { id, paid_amount: paidAmount, payment_status: status };
}

export async function invoiceDetailService(id) {
  const [invoice] = await q('SELECT * FROM invoices WHERE id=?', [id]);
  if (!invoice) throw new Error('Invoice not found');
  const items = await q('SELECT * FROM invoice_items WHERE invoice_id=?', [id]);
  return { ...invoice, items };
}
