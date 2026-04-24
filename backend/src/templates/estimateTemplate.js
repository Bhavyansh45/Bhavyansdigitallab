export const estimateHtml = ({ company, estimate }) => `
<html><body style="font-family:Arial;padding:24px">
<h2>${company.name} - Estimate</h2>
<p>Estimate #: ${estimate.id}</p>
<table width="100%" border="1" cellspacing="0" cellpadding="8">
<tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
${estimate.items.map(i => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.price}</td><td>${i.qty * i.price}</td></tr>`).join('')}
</table>
<h3>Total: ₹${estimate.total}</h3>
</body></html>`;
