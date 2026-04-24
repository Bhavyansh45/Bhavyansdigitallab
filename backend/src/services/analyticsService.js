import { q } from '../models/baseModel.js';

export async function monthlySummaryService() {
  const rows = await q(`
    SELECT DATE_FORMAT(txn_date, '%Y-%m') month,
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) expense
    FROM transactions
    GROUP BY DATE_FORMAT(txn_date, '%Y-%m')
    ORDER BY month ASC
  `);
  return rows.map((r) => ({ ...r, profit: Number(r.income) - Number(r.expense) }));
}

export async function categoryBreakdownService(type) {
  return q('SELECT category, SUM(amount) amount FROM transactions WHERE type=? GROUP BY category ORDER BY amount DESC', [type]);
}
