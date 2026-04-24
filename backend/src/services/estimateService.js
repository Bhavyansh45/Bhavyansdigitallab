import { q } from '../models/baseModel.js';

const sanitizeItems = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) throw new Error('At least one item is required');
  return items.map((item) => {
    const qty = Number(item.qty);
    const price = Number(item.price);
    if (!item.name || Number.isNaN(qty) || Number.isNaN(price) || qty <= 0 || price < 0) {
      throw new Error('Invalid estimate items');
    }
    return { name: item.name.trim(), qty, price, total: qty * price };
  });
};

const computeTotal = (items) => items.reduce((sum, i) => sum + i.total, 0);

export async function createEstimateService(payload) {
  const items = sanitizeItems(payload.items);
  const total = computeTotal(items);
  const result = await q(
    'INSERT INTO estimates (client_id, title, total_amount, status) VALUES (?,?,?,?)',
    [payload.client_id || null, payload.title, total, payload.status || 'Draft']
  );
  for (const i of items) {
    await q('INSERT INTO estimate_items (estimate_id, item_name, qty, unit_price, total_price) VALUES (?,?,?,?,?)', [result.insertId, i.name, i.qty, i.price, i.total]);
  }
  return { id: result.insertId, total };
}

export async function updateEstimateService(id, payload) {
  const items = sanitizeItems(payload.items);
  const total = computeTotal(items);
  await q('UPDATE estimates SET client_id=?, title=?, status=?, total_amount=? WHERE id=?', [payload.client_id || null, payload.title, payload.status || 'Draft', total, id]);
  await q('DELETE FROM estimate_items WHERE estimate_id=?', [id]);
  for (const i of items) {
    await q('INSERT INTO estimate_items (estimate_id, item_name, qty, unit_price, total_price) VALUES (?,?,?,?,?)', [id, i.name, i.qty, i.price, i.total]);
  }
  return { id, total };
}

export async function deleteEstimateService(id) {
  await q('DELETE FROM estimates WHERE id=?', [id]);
  return { id };
}

export async function duplicateEstimateService(id) {
  const [estimate] = await q('SELECT * FROM estimates WHERE id=?', [id]);
  if (!estimate) throw new Error('Estimate not found');
  const items = await q('SELECT item_name name, qty, unit_price price FROM estimate_items WHERE estimate_id=?', [id]);
  return createEstimateService({ client_id: estimate.client_id, title: `${estimate.title} (Copy)`, items, status: 'Draft' });
}

export async function setEstimateStatusService(id, status) {
  const allowed = ['Draft', 'Sent', 'Approved', 'Rejected'];
  if (!allowed.includes(status)) throw new Error('Invalid status');
  await q('UPDATE estimates SET status=? WHERE id=?', [status, id]);
  return { id, status };
}

export async function getEstimateWithItems(id) {
  const [estimate] = await q('SELECT * FROM estimates WHERE id=?', [id]);
  if (!estimate) throw new Error('Estimate not found');
  const items = await q('SELECT item_name name, qty, unit_price price, total_price total FROM estimate_items WHERE estimate_id=?', [id]);
  return { ...estimate, items };
}
