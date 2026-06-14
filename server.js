// Minimal zero-dependency static server for the Atsumi Labs site.
// Serves the files in this directory; runs under pm2 behind nginx.
//   PORT env (default 8124) — nginx proxies atsumilabs.com here.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 8124;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

const server = http.createServer((req, res) => {
  // Strip query string, decode, normalise.
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
  } catch {
    return send(res, 400, "Bad request");
  }
  if (urlPath === "/") urlPath = "/index.html";

  // Resolve inside ROOT and block path traversal.
  let filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) return send(res, 403, "Forbidden");

  // Pretty URLs: allow /privacy → /privacy.html
  if (!path.extname(filePath) && fs.existsSync(filePath + ".html")) {
    filePath += ".html";
  }

  fs.stat(filePath, (err, stat) => {
    if (err || stat.isDirectory()) {
      // Fall back to index.html for unknown paths (single error page).
      return fs.readFile(path.join(ROOT, "index.html"), (e, buf) =>
        e ? send(res, 404, "Not found") : send(res, 404, buf, { "Content-Type": TYPES[".html"] }),
      );
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = TYPES[ext] || "application/octet-stream";
    // Long cache for static assets, no-cache for HTML so updates show immediately.
    const cache = ext === ".html" ? "no-cache" : "public, max-age=86400";
    fs.createReadStream(filePath)
      .on("open", () => res.writeHead(200, { "Content-Type": type, "Cache-Control": cache }))
      .on("error", () => send(res, 500, "Server error"))
      .pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Atsumi Labs site running on http://127.0.0.1:${PORT}`);
});
