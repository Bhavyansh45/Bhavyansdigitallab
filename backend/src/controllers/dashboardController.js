import { q } from '../models/baseModel.js';

export const getDashboard = async (_req, res) => {
  const [revenue] = await q("SELECT COALESCE(SUM(amount),0) total FROM transactions WHERE type='income'");
  const [expense] = await q("SELECT COALESCE(SUM(amount),0) total FROM transactions WHERE type='expense'");
  const [pending] = await q("SELECT COUNT(*) count FROM invoices WHERE payment_status='Unpaid'");
  const [estimates] = await q('SELECT COUNT(*) count FROM estimates');

  return res.json({
    totalRevenue: revenue.total,
    totalExpense: expense.total,
    profit: revenue.total - expense.total,
    pendingInvoices: pending.count,
    totalEstimates: estimates.count
  });
};
