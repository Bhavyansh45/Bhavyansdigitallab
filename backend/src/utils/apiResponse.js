export const ok = (res, data = {}, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, data, message });

export const fail = (res, message = 'Request failed', status = 400, data = {}) =>
  res.status(status).json({ success: false, data, message });
