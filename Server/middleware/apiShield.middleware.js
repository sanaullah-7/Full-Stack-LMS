/**
 * Direct Browser Navigation Interceptor / API Shield Middleware
 *
 * Intercepts direct browser address-bar document navigations to backend API URLs
 * and returns a standard generic 404 Not Found response without leaking API structure,
 * internal route existence, controller details, stack traces, or 403 Forbidden messages.
 *
 * All legitimate programmatic API calls (Axios, Fetch, XHR, mobile, Postman, curl)
 * pass through normally to authentication and route handlers.
 */

const GENERIC_404_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>404 Not Found</title>
</head>
<body>
  <h1>404 Not Found</h1>
  <p>The requested resource was not found on this server.</p>
</body>
</html>`;

export const apiShield = (req, res, next) => {
  // Allow CORS preflight OPTIONS requests immediately
  if (req.method === "OPTIONS") {
    return next();
  }

  const secFetchMode = req.headers["sec-fetch-mode"];
  const secFetchDest = req.headers["sec-fetch-dest"];
  const acceptHeader = req.headers["accept"] || "";

  // Identify direct top-level browser address-bar navigation
  const isDirectBrowserNav =
    secFetchMode === "navigate" ||
    secFetchDest === "document" ||
    (acceptHeader.includes("text/html") &&
      !req.headers["x-requested-with"] &&
      !req.headers["x-app-client"] &&
      !acceptHeader.includes("application/json"));

  if (isDirectBrowserNav) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Cache-Control", "no-store, max-age=0");
    return res.status(404).send(GENERIC_404_HTML);
  }

  next();
};

export default apiShield;
