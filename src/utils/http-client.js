// --------------------------------------------------
// HTTP request helper
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

  const controller =
    new AbortController();

  const timeoutId =
    setTimeout(
      () => controller.abort(),
      timeout
    );

  try {
    const response =
      await fetch(url, {
        method,

        headers: {
          Accept: "application/json",
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
      });

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    let data;

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      data =
        await response.json();
    } else {
      data =
        await response.text();
    }

    if (!response.ok) {
      const error =
        new Error(
          typeof data === "object"
            ? data.message ||
              data.error ||
              `HTTP request failed with status ${response.status}`
            : `HTTP request failed with status ${response.status}`
        );

      error.status =
        response.status;

      error.data = data;

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
      const timeoutError =
        new Error(
          "External API request timed out"
        );

      timeoutError.code =
        "API_TIMEOUT";

      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}


// --------------------------------------------------
// JSON request helper
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
