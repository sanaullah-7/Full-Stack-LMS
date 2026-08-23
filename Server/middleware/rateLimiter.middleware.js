/**
 * High-Performance Sliding Window In-Memory Rate Limiter Middleware
 * Protects backend from DDoS, scraping, and brute-force attacks.
 */

const FAKE_429_HTML = `<!DOCTYPE html>
<html>
<head><title>429 Too Many Requests</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fff; color: #000; margin: 40px auto; max-width: 650px; padding: 0 20px;">
<h1 style="font-size: 28px; font-weight: 500; border-bottom: 1px solid #ccc; padding-bottom: 10px;">429 Too Many Requests</h1>
<p style="font-size: 14px; color: #333;">Too many requests received from this client. Please retry later.</p>
<hr style="border: 0; border-top: 1px solid #e0e0e0; margin-top: 20px;">
<p style="font-size: 12px; color: #777;">nginx</p>
</body>
</html>`;

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes default
  max = 100,                  // max requests per window
  message = "Too many requests, please try again later.",
  sendHtml = true,
}) => {
  const hits = new Map();

  // Periodic cleanup of expired IP timestamps every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of hits.entries()) {
      const valid = timestamps.filter((time) => now - time < windowMs);
      if (valid.length === 0) {
        hits.delete(ip);
      } else {
        hits.set(ip, valid);
      }
    }
  }, 5 * 60 * 1000);

  return (req, res, next) => {
    // Determine client IP (handles reverse proxies & load balancers)
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    const now = Date.now();
    const timestamps = hits.get(ip) || [];

    // Filter to timestamps within current rolling window
    const recentHits = timestamps.filter((time) => now - time < windowMs);

    if (recentHits.length >= max) {
      res.setHeader("Retry-After", Math.ceil(windowMs / 1000));
      if (sendHtml) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.status(429).send(FAKE_429_HTML);
      } else {
        return res.status(429).json({
          status: 429,
          message,
        });
      }
    }

    recentHits.push(now);
    hits.set(ip, recentHits);
    next();
  };
};

// 1. Strict Limiter for Auth / Login (15 attempts / 15 mins)
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many login attempts. Please try again after 15 minutes.",
  sendHtml: false, // Return JSON for app toast handling
});

// 2. Global General API Limiter (300 requests / 15 mins)
export const globalApiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests. Please try again later.",
  sendHtml: true,
});
