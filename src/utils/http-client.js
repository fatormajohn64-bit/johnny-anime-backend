import { AppError } from "../middleware/app-error.js";

// --------------------------------------------------
// Parse response body
// --------------------------------------------------

async function parseResponse(
  response
) {
  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
}


// --------------------------------------------------
// HTTP request
// --------------------------------------------------

export async function httpRequest(
  url,
  options = {}
) {
  const {
    method = "GET",
    headers = {},
    body = null,
    timeout = 15000
  } = options;

  if (
    typeof url !== "string" ||
    !url.trim()
  ) {
    throw new AppError(
      "A valid request URL is required",
      500,
      "INVALID_REQUEST_URL"
    );
  }

  const controller =
    new AbortController();

  const timeoutId =
    setTimeout(
      () => {
        controller.abort();
      },
      timeout
    );

  try {
    const response =
      await fetch(
        url,
        {
          method,

          headers: {
            Accept:
              "application/json",
            ...headers
          },

          body:
            body === null
              ? undefined
              : typeof body === "string"
                ? body
                : JSON.stringify(body),

          signal:
            controller.signal
        }
      );

    const data =
      await parseResponse(
        response
      );

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null
          ? data.message ||
            data.error ||
            data.detail ||
            `External API request failed with status ${response.status}`
          : `External API request failed with status ${response.status}`;

      const error =
        new AppError(
          message,
          response.status,
          "EXTERNAL_API_ERROR"
        );

      error.data =
        data;

      error.url =
        url;

      throw error;
    }

    return {
      data,
      status:
        response.status,
      headers:
        response.headers
    };
  } catch (error) {
    if (
      error.name ===
      "AbortError"
    ) {
      throw new AppError(
        "External API request timed out",
        504,
        "API_TIMEOUT"
      );
    }

    throw error;
  } finally {
    clearTimeout(
      timeoutId
    );
  }
}


// --------------------------------------------------
// JSON request
// --------------------------------------------------

export async function httpJson(
  url,
  options = {}
) {
  return httpRequest(
    url,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",

        ...options.headers
      }
    }
  );
}


// --------------------------------------------------
// GET request
// --------------------------------------------------

export async function httpGet(
  url,
  options = {}
) {
  return httpRequest(
    url,
    {
      ...options,
      method: "GET"
    }
  );
}


// --------------------------------------------------
// POST request
// --------------------------------------------------

export async function httpPost(
  url,
  body = null,
  options = {}
) {
  return httpJson(
    url,
    {
      ...options,
      method: "POST",
      body
    }
  );
}
