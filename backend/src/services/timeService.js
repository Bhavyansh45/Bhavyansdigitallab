import { q } from '../models/baseModel.js';

export async function addTimeEntryService(payload) {
  const result = await q('INSERT INTO time_entries (project_id, hours, entry_date, notes) VALUES (?,?,?,?)', [payload.project_id, payload.hours, payload.entry_date, payload.notes || null]);
  return { id: result.insertId };
}

export async function projectTimeSummaryService() {
  return q(`
    SELECT p.id project_id, p.name project_name,
      COALESCE(SUM(t.hours), 0) total_hours,
      p.budget,
      COALESCE(SUM(t.hours), 0) * 500 AS estimated_cost
    FROM projects p
    LEFT JOIN time_entries t ON t.project_id = p.id
    GROUP BY p.id, p.name, p.budget
    ORDER BY p.id DESC
  `);
}
