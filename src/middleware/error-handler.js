export function notFoundHandler(
  req,
  res
) {
  res.status(404).json({
    success: false,

    error: "Route not found",

    path:
      req.originalUrl,

    method:
      req.method
  });
}


// --------------------------------------------------
// Global error handler
// --------------------------------------------------

export function errorHandler(
  err,
  req,
  res,
  next
) {
  console.error(
    "Server error:",
    err
  );

  // -----------------------------------------------
  // Validation errors
  // -----------------------------------------------

  if (
    err.name ===
    "ValidationError"
  ) {
    return res.status(400).json({
      success: false,

      error:
        err.message
    });
  }


  // -----------------------------------------------
  // PostgreSQL errors
  // -----------------------------------------------

  if (err.code) {
    switch (err.code) {
      case "23505":
        return res.status(409).json({
          success: false,

          error:
            "A record with this value already exists"
        });

      case "23503":
        return res.status(400).json({
          success: false,

          error:
            "Referenced record does not exist"
        });

      case "23502":
        return res.status(400).json({
          success: false,

          error:
            "A required database field is missing"
        });

      case "22P02":
        return res.status(400).json({
          success: false,

          error:
            "Invalid data format"
        });

      default:
        break;
    }
  }


  // -----------------------------------------------
  // Custom status errors
  // -----------------------------------------------

  if (
    Number.isInteger(
      err.status
    )
  ) {
    return res.status(
      err.status
    ).json({
      success: false,

      error:
        err.message ||
        "Request failed"
    });
  }


  // -----------------------------------------------
  // Default server error
  // -----------------------------------------------

  res.status(500).json({
    success: false,

    error:
      "Internal server error"
  });
}
