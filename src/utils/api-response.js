export function successResponse(
  res,
  data = {},
  status = 200
) {
  return res.status(status).json({
    success: true,
    ...data
  });
}


export function errorResponse(
  res,
  error,
  status = 400,
  extra = {}
) {
  return res.status(status).json({
    success: false,
    error,
    ...extra
  });
}
