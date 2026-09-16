// --------------------------------------------------
// Get pagination values
// --------------------------------------------------

export function getPagination(
  query,
  defaults = {}
) {
  const defaultLimit =
    defaults.limit || 20;

  const maxLimit =
    defaults.maxLimit || 100;

  let limit =
    Number(
      query.limit ||
      defaultLimit
    );

  let offset =
    Number(
      query.offset || 0
    );

  if (
    !Number.isInteger(limit) ||
    limit < 1
  ) {
    limit =
      defaultLimit;
  }

  if (limit > maxLimit) {
    limit =
      maxLimit;
  }

  if (
    !Number.isInteger(offset) ||
    offset < 0
  ) {
    offset = 0;
  }

  return {
    limit,
    offset
  };
}


// --------------------------------------------------
// Create pagination response
// --------------------------------------------------

export function paginationResponse(
  items,
  limit,
  offset,
  total
) {
  return {
    items,

    pagination: {
      limit,
      offset,

      total,

      hasMore:
        offset + items.length <
        total
    }
  };
}
