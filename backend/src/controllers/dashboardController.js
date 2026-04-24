import { q } from '../models/baseModel.js';
import { ok } from '../utils/apiResponse.js';

export const getDashboard = async (_req, res) => {
  const [revenue] = await q("SELECT COALESCE(SUM(amount),0) total FROM transactions WHERE type='income'");
  const [expense] = await q("SELECT COALESCE(SUM(amount),0) total FROM transactions WHERE type='expense'");
  const [pending] = await q("SELECT COUNT(*) count FROM invoices WHERE payment_status='Unpaid'");
  const [estimates] = await q('SELECT COUNT(*) count FROM estimates');
  return ok(res, {
    totalRevenue: Number(revenue.total),
    totalExpense: Number(expense.total),
    profit: Number(revenue.total) - Number(expense.total),
    pendingInvoices: Number(pending.count),
    totalEstimates: Number(estimates.count)
  });
};
