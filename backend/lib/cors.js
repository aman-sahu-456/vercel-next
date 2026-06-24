// Shared CORS handling for the API routes.
//
// ALLOWED_ORIGIN can be:
//   - unset            -> allow any origin ("*")  [fine for testing]
//   - a single origin  -> e.g. https://my-app.vercel.app
//   - a comma list     -> e.g. https://my-app.vercel.app,http://localhost:3000
//
// When a list is given, the request's Origin is echoed back only if it matches.

function allowedList() {
  return (process.env.ALLOWED_ORIGIN || "*")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

// Build CORS headers for a given request.
export function corsHeaders(request) {
  const list = allowedList();
  const reqOrigin = request?.headers?.get("origin") || "";

  let allowOrigin;
  if (list.includes("*")) {
    allowOrigin = "*";
  } else if (reqOrigin && list.includes(reqOrigin)) {
    allowOrigin = reqOrigin;
  } else {
    // Not in the allow-list: fall back to the first configured origin.
    allowOrigin = list[0] || "*";
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    // Responses differ per Origin, so caches must key on it.
    Vary: "Origin",
  };
}
