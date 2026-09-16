export function requireIntegerParam(
  paramName
) {
  return (req, res, next) => {
    const value =
      Number(req.params[paramName]);

    if (!Number.isInteger(value)) {
      return res.status(400).json({
        success: false,
        error:
          `Invalid ${paramName}`
      });
    }

    req.params[paramName] =
      value;

    next();
  };
}


// --------------------------------------------------
// Required body fields
// --------------------------------------------------

export function requireFields(
  fields
) {
  return (req, res, next) => {
    const missing = fields.filter(
      (field) => {
        const value =
          req.body?.[field];

        return (
          value === undefined ||
          value === null ||
          value === ""
        );
      }
    );

    if (missing.length) {
      return res.status(400).json({
        success: false,

        error:
          "Required fields are missing",

        fields: missing
      });
    }

    next();
  };
}


// --------------------------------------------------
// Positive integer body field
// --------------------------------------------------

export function validatePositiveInteger(
  field
) {
  return (req, res, next) => {
    const value =
      Number(req.body?.[field]);

    if (
      !Number.isInteger(value) ||
      value <= 0
    ) {
      return res.status(400).json({
        success: false,

        error:
          `${field} must be a positive integer`
      });
    }

    req.body[field] = value;

    next();
  };
}


// --------------------------------------------------
// Non-negative number body field
// --------------------------------------------------

export function validateNonNegativeNumber(
  field
) {
  return (req, res, next) => {
    const value =
      Number(req.body?.[field]);

    if (
      !Number.isFinite(value) ||
      value < 0
    ) {
      return res.status(400).json({
        success: false,

        error:
          `${field} must be a non-negative number`
      });
    }

    req.body[field] = value;

    next();
  };
}


// --------------------------------------------------
// Pagination
// --------------------------------------------------

export function validatePagination(
  req,
  res,
  next
) {
  const limit =
    Number(req.query.limit || 20);

  if (
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100
  ) {
    return res.status(400).json({
      success: false,

      error:
        "Limit must be between 1 and 100"
    });
  }

  req.query.limit = limit;

  next();
}
