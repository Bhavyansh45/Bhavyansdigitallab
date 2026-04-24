import { fail } from '../utils/apiResponse.js';

export const notFound = (_req, res) => fail(res, 'Route not found', 404);

export const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  return fail(res, err.message || 'Internal server error', status);
};
