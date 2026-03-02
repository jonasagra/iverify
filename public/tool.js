// ============================
// Consulta publica (sem cadastro)
// ============================
const numberModelOutput = document.getElementById("numberModelOutput");
const countryOutput = document.getElementById("countryOutput");
const modelOutput = document.getElementById("modelOutput");
const modelPhotosOutput = document.getElementById("modelPhotosOutput");
const sulfixOutput = document.getElementById("sulfixOutput");
const typeOutput = document.getElementById("typeOutput");
const colorOutput = document.getElementById("colorOutput");
const storageOutput = document.getElementById("storageOutput");
const invalidOutput = document.getElementById("invalidOutput");
const colorSwatchesOutput = document.getElementById("colorSwatchesOutput");

const modalContainer = document.getElementById("modalContainer");
const closeBtn = document.getElementById("closeBtn");
const modelInput = document.getElementById("modelInput");
const checkBtn = document.getElementById("checkBtn");
const darkMode = document.getElementById("themeToggleApple");

const regexModel = /^([MNPF])([A-Z0-9]{4,6})([A-Z]{2})(?:\/([A-Z]{1,2}))?$/;
const countryMap = {
    BR: "Brasil",
    LL: "EUA",
    JP: "Japao",
    CH: "China",
    ZP: "Hong Kong",
    EU: "Europa"
};
const typeMap = {
    M: "Novo",
    N: "Substituicao",
    F: "Recondicionado",
    P: "Personalizado"
};

const appleColorPalette = [
    { name: "Preto", hex: "#202124" },
    { name: "Branco", hex: "#f2f2f2" },
    { name: "Prata", className: "swatch-metal-silver" },
    { name: "Dourado", className: "swatch-metal-gold" },
    { name: "Grafite", className: "swatch-metal-graphite" },
    { name: "Titânio", className: "swatch-metal-titanium" },
    { name: "Titânio Natural", className: "swatch-metal-titanium" },
    { name: "Titânio Azul", className: "swatch-metal-titanium" },
    { name: "Titânio Branco", className: "swatch-metal-silver" },
    { name: "Titânio Preto", className: "swatch-metal-graphite" },
    { name: "Laranja", className: "swatch-metal-orange" },
    { name: "Azul", hex: "#3f75ff" },
    { name: "Azul-Pacífico", hex: "#1b4f76" },
    { name: "Azul-Sierra", hex: "#9fb7d8" },
    { name: "Roxo Profundo", hex: "#4a2f5f" },
    { name: "Roxo", hex: "#6e52a3" },
    { name: "Verde", hex: "#4f7f5b" },
    { name: "Verde-alpino", hex: "#5b6e56" },
    { name: "Amarelo", hex: "#f1d04b" },
    { name: "Vermelho", hex: "#c62f3b" },
    { name: "(PRODUCT)RED", hex: "#c62f3b" },
    { name: "Rosa", hex: "#e7a1b0" },
    { name: "Coral", hex: "#ff7f50" },
    { name: "Estelar", hex: "#f3ecd4" },
    { name: "Meia-noite", hex: "#232a34" },
    { name: "Cinza-espacial", className: "swatch-metal-graphite" },
    { name: "Preto-espacial", className: "swatch-metal-graphite" }
];

const colorAliasMap = {
    "blue": "Azul",
    "pacific blue": "Azul-Pacífico",
    "sierra blue": "Azul-Sierra",
    "alpine green": "Verde-alpino",
    "green": "Verde",
    "yellow": "Amarelo",
    "pink": "Rosa",
    "purple": "Roxo",
    "deep purple": "Roxo Profundo",
    "titanium": "Titânio",
    "natural titanium": "Titânio Natural",
    "blue titanium": "Titânio Azul",
    "white titanium": "Titânio Branco",
    "black titanium": "Titânio Preto",
    "starlight": "Estelar",
    "space gray": "Cinza-espacial",
    "space black": "Preto-espacial",
    "midnight": "Meia-noite",
    "meia-noite": "Meia-noite",
    "meia noite": "Meia-noite"
};

let modelCatalog = [];

function canonicalizeColorName(value) {
    const cleaned = String(value || "").trim();
    if (!cleaned) return "";
    const alias = colorAliasMap[cleaned.toLowerCase()];
    return alias || cleaned;
}

function normalizeColorNames(value) {
    if (Array.isArray(value)) {
        return [...new Set(value.map(canonicalizeColorName).filter(Boolean))];
    }
    if (typeof value === "string") {
        return [...new Set(value.split(",").map(canonicalizeColorName).filter(Boolean))];
    }
    return [];
}

function normalizeStorageValues(value) {
    if (Array.isArray(value)) {
        return [...new Set(value.map((v) => String(v).trim().toUpperCase()).filter(Boolean))];
    }
    if (typeof value === "string") {
        return [...new Set(value.split(",").map((v) => v.trim().toUpperCase()).filter(Boolean))];
    }
    return [];
}

function normalizePhotoUrls(value) {
    if (Array.isArray(value)) {
        return [...new Set(value.map((v) => String(v).trim()).filter(Boolean))];
    }
    if (typeof value === "string") {
        return [...new Set(value.split(",").map((v) => v.trim()).filter(Boolean))];
    }
    return [];
}

function findPaletteColor(name) {
    const normalized = canonicalizeColorName(name).toLowerCase();
    return appleColorPalette.find((item) => item.name.toLowerCase() === normalized);
}

function renderResultColorSwatches(colors) {
    colorSwatchesOutput.innerHTML = "";
    colors.forEach((name) => {
        const meta = findPaletteColor(name);
        const sw = document.createElement("span");
        sw.className = "colorSwatch";
        sw.title = name;
        sw.setAttribute("aria-label", name);
        if (meta?.className) {
            sw.classList.add(meta.className);
        } else if (meta?.hex) {
            sw.style.background = meta.hex;
        } else {
            sw.style.background = "#cccccc";
        }
        colorSwatchesOutput.appendChild(sw);
    });
}

function renderModelPhotos(photos, modelName) {
    modelPhotosOutput.innerHTML = "";
    const photoList = normalizePhotoUrls(photos);

    if (photoList.length === 0) {
        const empty = document.createElement("p");
        empty.className = "modelPhotoEmpty";
        empty.textContent = "Sem fotos cadastradas para este modelo.";
        modelPhotosOutput.appendChild(empty);
        return;
    }

    photoList.forEach((url, index) => {
        const img = document.createElement("img");
        img.className = "modelPhotoItem";
        img.src = url;
        img.alt = `${modelName} - foto ${index + 1}`;
        img.loading = "lazy";
        modelPhotosOutput.appendChild(img);
    });
}

function parseTechnicalCode(fullCode) {
    const normalized = fullCode.trim().toUpperCase();
    const match = normalized.match(regexModel);
    if (!match) return null;
    const [, typeCode, innerCode, countryCode, sulfixCode] = match;
    return { normalized, typeCode, innerCode, countryCode, sulfixCode: sulfixCode || "-" };
}

function buildResult(fullCode) {
    const parsed = parseTechnicalCode(fullCode);
    if (!parsed) return null;

    const found = modelCatalog.find((item) => Array.isArray(item.codes) && item.codes.includes(parsed.innerCode));

    return {
        fullCode: parsed.normalized,
        country: countryMap[parsed.countryCode] || parsed.countryCode,
        modelName: found ? found.name : "Modelo desconhecido",
        colors: found ? normalizeColorNames(found.color) : ["Desconhecida"],
        storages: found ? normalizeStorageValues(found.storage) : ["Desconhecido"],
        photos: found ? normalizePhotoUrls(found.photos) : [],
        sulfix: parsed.sulfixCode,
        type: typeMap[parsed.typeCode] || parsed.typeCode
    };
}

function clearOutputs() {
    numberModelOutput.textContent = "";
    countryOutput.textContent = "";
    modelOutput.textContent = "";
    sulfixOutput.textContent = "";
    typeOutput.textContent = "";
    colorOutput.textContent = "";
    storageOutput.textContent = "";
    invalidOutput.textContent = "";
    colorSwatchesOutput.innerHTML = "";
    modelPhotosOutput.innerHTML = "";
}

checkBtn.addEventListener("click", () => {
    const fullCode = modelInput.value.trim().toUpperCase();
    clearOutputs();

    if (!fullCode) {
        invalidOutput.textContent = "Por favor, insira um modelo valido.";
        modalContainer.style.display = "block";
        return;
    }

    const result = buildResult(fullCode);
    if (!result) {
        invalidOutput.textContent = "Formato invalido. Exemplo: MLPF3BR/A";
        modalContainer.style.display = "block";
        return;
    }

    numberModelOutput.textContent = `Codigo completo: ${result.fullCode}`;
    countryOutput.textContent = `Pais do fabricante: ${result.country}`;
    modelOutput.textContent = `Modelo: ${result.modelName}`;
    sulfixOutput.textContent = `Sufixo: ${result.sulfix}`;
    typeOutput.textContent = `Tipo: ${result.type}`;
    colorOutput.textContent = `Cores disponiveis: ${result.colors.join(", ")}`;
    storageOutput.textContent = `Armazenamentos: ${result.storages.join(", ")}`;
    renderResultColorSwatches(result.colors);
    renderModelPhotos(result.photos, result.modelName);
    modalContainer.style.display = "block";
});

closeBtn.addEventListener("click", () => {
    modalContainer.style.display = "none";
});

darkMode.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", darkMode.checked);
});

async function initCatalog() {
    try {
        const response = await fetch("./models.json", { cache: "no-store" });
        if (!response.ok) throw new Error("Falha ao carregar models.json");
        const parsed = await response.json();
        modelCatalog = Array.isArray(parsed) ? parsed : [];
    } catch {
        modelCatalog = [];
    }
}

initCatalog();
