const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = path.join(root, "models.json");
const targetDir = path.join(root, "public");
const target = path.join(targetDir, "models.json");

function fail(message) {
  console.error(`ERRO: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(source)) {
  fail(`Arquivo nao encontrado: ${source}`);
}

const raw = fs.readFileSync(source, "utf8");
const sanitized = raw.replace(/^\uFEFF/, "");

try {
  JSON.parse(sanitized);
} catch (error) {
  fail(`JSON invalido em models.json (${error.message})`);
}

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(target, sanitized, "utf8");

console.log("OK: models.json sincronizado para public/models.json");
