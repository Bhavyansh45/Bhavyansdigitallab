import { ok } from '../utils/apiResponse.js';
import { categoryBreakdownService, monthlySummaryService } from '../services/analyticsService.js';

export const monthlySummary = async (_req, res) => ok(res, await monthlySummaryService());
export const incomeCategory = async (_req, res) => ok(res, await categoryBreakdownService('income'));
export const expenseCategory = async (_req, res) => ok(res, await categoryBreakdownService('expense'));
