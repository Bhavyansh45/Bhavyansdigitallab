export const estimateHtml = ({ company, estimate }) => `
<html><body style="font-family:Arial;padding:24px;color:#111">
<div style="display:flex;justify-content:space-between;align-items:start">
  <div>
    <h2 style="margin:0">${company.name || ''}</h2>
    <div>${company.address || ''}</div>
    <div>${company.email || ''} ${company.phone ? `| ${company.phone}` : ''}</div>
    <div>${company.gst ? `GST: ${company.gst}` : ''}</div>
  </div>
  <h3>Estimate #${estimate.id}</h3>
</div>
<table width="100%" border="1" cellspacing="0" cellpadding="8" style="margin-top:12px;border-collapse:collapse">
<tr><th align="left">Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
${estimate.items.map(i => `<tr><td>${i.name}</td><td align="center">${i.qty}</td><td align="right">${Number(i.price).toFixed(2)}</td><td align="right">${(Number(i.qty) * Number(i.price)).toFixed(2)}</td></tr>`).join('')}
</table>
<h3 style="text-align:right">Total: ₹${Number(estimate.total).toFixed(2)}</h3>
</body></html>`;
