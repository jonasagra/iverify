const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");

const PORT = 3000;
const ROOT = __dirname;
const MODELS_PATH = path.join(ROOT, "models.json");

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".woff": "font/woff",
    ".otf": "font/otf"
};

function send(res, status, body, contentType = "text/plain; charset=utf-8") {
    res.writeHead(status, { "Content-Type": contentType });
    res.end(body);
}

async function serveFile(reqPath, res) {
    const safePath = reqPath === "/" ? "/index.html" : reqPath;
    const resolved = path.join(ROOT, path.normalize(safePath));

    // Protege contra path traversal
    if (!resolved.startsWith(ROOT)) {
        send(res, 403, "Forbidden");
        return;
    }

    try {
        const data = await fs.readFile(resolved);
        const ext = path.extname(resolved).toLowerCase();
        send(res, 200, data, MIME[ext] || "application/octet-stream");
    } catch {
        send(res, 404, "Not Found");
    }
}

async function readModels() {
    const raw = await fs.readFile(MODELS_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
}

async function writeModels(models) {
    const pretty = JSON.stringify(models, null, 2);
    await fs.writeFile(MODELS_PATH, pretty, "utf8");
}

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/api/models" && req.method === "GET") {
        try {
            const models = await readModels();
            send(res, 200, JSON.stringify(models), MIME[".json"]);
        } catch {
            send(res, 500, JSON.stringify({ error: "Falha ao ler models.json" }), MIME[".json"]);
        }
        return;
    }

    if (url.pathname === "/api/models" && req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
            if (body.length > 10 * 1024 * 1024) req.destroy(); // limite 10MB
        });

        req.on("end", async () => {
            try {
                const parsed = JSON.parse(body);
                if (!Array.isArray(parsed)) {
                    send(res, 400, JSON.stringify({ error: "JSON precisa ser um array" }), MIME[".json"]);
                    return;
                }
                await writeModels(parsed);
                send(res, 200, JSON.stringify({ ok: true }), MIME[".json"]);
            } catch {
                send(res, 400, JSON.stringify({ error: "JSON inválido" }), MIME[".json"]);
            }
        });
        return;
    }

    await serveFile(url.pathname, res);
});

server.listen(PORT, () => {
    console.log(`Servidor ativo em http://localhost:${PORT}`);
});
