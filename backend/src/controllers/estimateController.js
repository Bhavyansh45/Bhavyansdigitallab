import { ok } from '../utils/apiResponse.js';
import { q } from '../models/baseModel.js';
import { estimateHtml } from '../templates/estimateTemplate.js';
import { renderPdf } from '../utils/pdf.js';
import { createEstimateService, deleteEstimateService, duplicateEstimateService, getEstimateWithItems, setEstimateStatusService, updateEstimateService } from '../services/estimateService.js';
import { getActiveSettingsService } from '../services/settingsService.js';

export const listEstimates = async (_req, res) => ok(res, await q('SELECT * FROM estimates ORDER BY id DESC'));

export const createEstimate = async (req, res) => {
  const data = await createEstimateService(req.body);
  return ok(res, data, 'Estimate created', 201);
};

export const updateEstimate = async (req, res) => ok(res, await updateEstimateService(req.params.id, req.body), 'Estimate updated');
export const deleteEstimate = async (req, res) => ok(res, await deleteEstimateService(req.params.id), 'Estimate deleted');
export const duplicateEstimate = async (req, res) => ok(res, await duplicateEstimateService(req.params.id), 'Estimate duplicated', 201);
export const updateEstimateStatus = async (req, res) => ok(res, await setEstimateStatusService(req.params.id, req.body.status), 'Estimate status updated');

export const estimatePdf = async (req, res) => {
  const estimate = await getEstimateWithItems(req.params.id);
  const settings = await getActiveSettingsService();
  const pdf = await renderPdf(estimateHtml({
    company: {
      name: settings.company_name,
      email: settings.email,
      phone: settings.phone,
      address: settings.address,
      gst: settings.gst_number
    },
    estimate: { id: estimate.id, total: estimate.total_amount, items: estimate.items }
  }));

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=estimate-${req.params.id}.pdf`);
  return res.send(pdf);
};
