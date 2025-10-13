export function errorResponse(
  status: number,
  message: string,
  details?: Record<string, unknown>,
): Response {
  return Response.json({ error: message, ...(details ?? {}) }, { status });
}
