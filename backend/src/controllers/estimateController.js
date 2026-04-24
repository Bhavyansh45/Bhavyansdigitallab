import { q } from '../models/baseModel.js';
import { estimateHtml } from '../templates/estimateTemplate.js';
import { renderPdf } from '../utils/pdf.js';

export const createEstimate = async (req, res) => {
  const { client_id, title, items = [] } = req.body;
  const total = items.reduce((sum, i) => sum + Number(i.qty) * Number(i.price), 0);
  const result = await q('INSERT INTO estimates (client_id, title, total_amount, status) VALUES (?,?,?,?)', [client_id, title, total, 'Draft']);
  const estimateId = result.insertId;

  for (const item of items) {
    await q('INSERT INTO estimate_items (estimate_id, item_name, qty, unit_price, total_price) VALUES (?,?,?,?,?)', [estimateId, item.name, item.qty, item.price, item.qty * item.price]);
  }

  return res.status(201).json({ id: estimateId, total });
};

export const estimatePdf = async (req, res) => {
  const estimateId = req.params.id;
  const [estimate] = await q('SELECT * FROM estimates WHERE id=?', [estimateId]);
  const items = await q('SELECT item_name name, qty, unit_price price FROM estimate_items WHERE estimate_id=?', [estimateId]);

  const pdf = await renderPdf(
    estimateHtml({
      company: { name: 'Bhavyansh Digital Lab' },
      estimate: { id: estimate.id, total: estimate.total_amount, items }
    })
  );

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=estimate-${estimateId}.pdf`);
  return res.send(pdf);
};
