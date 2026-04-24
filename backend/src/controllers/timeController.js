import { ok } from '../utils/apiResponse.js';
import { addTimeEntryService, projectTimeSummaryService } from '../services/timeService.js';

export const addTimeEntry = async (req, res) => ok(res, await addTimeEntryService(req.body), 'Time entry added', 201);
export const timeSummary = async (_req, res) => ok(res, await projectTimeSummaryService());
