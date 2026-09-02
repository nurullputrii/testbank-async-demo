/**
 * v1 response helper. DEPRECATED.
 *
 * All six route files still use it. The v2 contract lives in
 * src/utils/envelope.js. Migrating every route is Task 1 in TASKS.md.
 *
 * Shape: { status: "OK" | "ERROR", result: <payload> }
 */
export function legacyResponse(res, result, statusCode = 200) {
  return res.status(statusCode).json({
    status: statusCode < 400 ? 'OK' : 'ERROR',
    result,
  });
}
