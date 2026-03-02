/* ============================================================
   Secao 1: Elementos da interface
============================================================ */
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
const addInfoBtn = document.getElementById("addInfoBtn");

const darkMode = document.getElementById("themeToggleApple");
const registerModal = document.getElementById("registerModal");
const registerCloseBtn = document.getElementById("registerCloseBtn");
const registerForm = document.getElementById("registerForm");
const registerFullCode = document.getElementById("registerFullCode");
const registerCountry = document.getElementById("registerCountry");
const registerType = document.getElementById("registerType");
const registerModelName = document.getElementById("registerModelName");
const registerPhotos = document.getElementById("registerPhotos");
const registerMessage = document.getElementById("registerMessage");
const colorPalette = document.getElementById("colorPalette");
const colorSelectionInfo = document.getElementById("colorSelectionInfo");
const storagePalette = document.getElementById("storagePalette");
const storageSelectionInfo = document.getElementById("storageSelectionInfo");

modalContainer.style.display = "none";
registerModal.style.display = "none";

/* ============================================================
   Secao 2: Regras de codigo tecnico
============================================================ */
const regexModel = /^([MNPF])([A-Z0-9]{4,6})([A-Z]{2})(?:\/([A-Z]{1,2}))?$/;
const innerCodeRegex = /^[A-Z0-9]{4,6}$/;
const typedInnerRegex = /^([MNPF])([A-Z0-9]{3,5})$/;
const storageKey = "iphoneModelCatalog";

const typeMap = {
    M: "Novo",
    N: "Substituicao",
    F: "Recondicionado",
    P: "Personalizado"
};

const countryMap = {
    BR: "Brasil",
    LL: "EUA",
    JP: "Japao",
    CH: "China",
    ZP: "Hong Kong",
    EU: "Europa"
};
const countryCodes = Object.keys(countryMap);
const storageOptions = ["4GB", "8GB", "16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];

/* ============================================================
   Secao 3: Paleta de cores Apple (visual)
============================================================ */
const appleColorPalette = [
    { name: "Preto", hex: "#202124" },
    { name: "Branco", hex: "#f2f2f2" },
    { name: "Prata", className: "swatch-metal-silver" },
    { name: "Dourado", className: "swatch-metal-gold" },
    { name: "Grafite", className: "swatch-metal-graphite" },
    { name: "Titânio", className: "swatch-metal-titanium" },
    { name: "Titanium", className: "swatch-metal-titanium" },
    { name: "Natural Titanium", className: "swatch-metal-titanium" },
    { name: "Blue Titanium", className: "swatch-metal-titanium" },
    { name: "White Titanium", className: "swatch-metal-silver" },
    { name: "Black Titanium", className: "swatch-metal-graphite" },
    { name: "Laranja", className: "swatch-metal-orange" },
    { name: "Azul", hex: "#3f75ff" },
    { name: "Azul-Pacifico", hex: "#1b4f76" },
    { name: "Azul-Sierra", hex: "#9fb7d8" },
    { name: "Deep Purple", hex: "#4a2f5f" },
    { name: "Purple", hex: "#6e52a3" },
    { name: "Verde", hex: "#4f7f5b" },
    { name: "Green", hex: "#4f7f5b" },
    { name: "Verde-alpino", hex: "#5b6e56" },
    { name: "Amarelo", hex: "#f1d04b" },
    { name: "Yellow", hex: "#f1d04b" },
    { name: "Vermelho", hex: "#c62f3b" },
    { name: "(PRODUCT)RED", hex: "#c62f3b" },
    { name: "Rosa", hex: "#e7a1b0" },
    { name: "Pink", hex: "#e7a1b0" },
    { name: "Coral", hex: "#ff7f50" },
    { name: "Starlight", hex: "#f3ecd4" },
    { name: "Meia-noite", hex: "#232a34" },
    { name: "Space Gray", className: "swatch-metal-graphite" },
    { name: "Space Black", className: "swatch-metal-graphite" }
];

const selectedRegisterColors = new Set();
const selectedRegisterStorages = new Set();

const colorAliasMap = {
    "blue": "Azul",
    "pacific blue": "Azul-Pacifico",
    "sierra blue": "Azul-Sierra",
    "alpine green": "Verde-alpino",
    "midnight": "Meia-noite",
    "meia-noite": "Meia-noite",
    "meia noite": "Meia-noite"
};

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

function updateColorSelectionInfo() {
    const colors = Array.from(selectedRegisterColors);
    colorSelectionInfo.textContent = colors.length === 0
        ? "Nenhuma cor selecionada."
        : `Selecionadas: ${colors.join(", ")}`;
}

function updateStorageSelectionInfo() {
    const storages = Array.from(selectedRegisterStorages);
    storageSelectionInfo.textContent = storages.length === 0
        ? "Nenhum armazenamento selecionado."
        : `Selecionados: ${storages.join(", ")}`;
}

function setRegisterSelectedColors(colors) {
    selectedRegisterColors.clear();
    normalizeColorNames(colors).forEach((name) => selectedRegisterColors.add(name));
    const buttons = colorPalette.querySelectorAll(".colorSwatch");
    buttons.forEach((btn) => {
        const name = btn.dataset.colorName;
        btn.setAttribute("aria-pressed", selectedRegisterColors.has(name) ? "true" : "false");
    });
    updateColorSelectionInfo();
}

function setRegisterSelectedStorages(storages) {
    selectedRegisterStorages.clear();
    normalizeStorageValues(storages).forEach((s) => selectedRegisterStorages.add(s));
    const chips = storagePalette.querySelectorAll(".storageChip");
    chips.forEach((chip) => {
        const value = chip.dataset.storageValue;
        chip.setAttribute("aria-pressed", selectedRegisterStorages.has(value) ? "true" : "false");
    });
    updateStorageSelectionInfo();
}

function buildColorPalette() {
    colorPalette.innerHTML = "";
    appleColorPalette.forEach((item) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "colorSwatch";
        btn.dataset.colorName = item.name;
        btn.title = item.name;
        btn.setAttribute("aria-label", item.name);
        btn.setAttribute("aria-pressed", "false");

        if (item.className) {
            btn.classList.add(item.className);
        } else if (item.hex) {
            btn.style.background = item.hex;
        }

        btn.addEventListener("click", () => {
            if (selectedRegisterColors.has(item.name)) {
                selectedRegisterColors.delete(item.name);
                btn.setAttribute("aria-pressed", "false");
            } else {
                selectedRegisterColors.add(item.name);
                btn.setAttribute("aria-pressed", "true");
            }
            updateColorSelectionInfo();
        });

        colorPalette.appendChild(btn);
    });
}

function buildStoragePalette() {
    storagePalette.innerHTML = "";
    storageOptions.forEach((storage) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "storageChip";
        chip.dataset.storageValue = storage;
        chip.textContent = storage;
        chip.setAttribute("aria-pressed", "false");
        chip.addEventListener("click", () => {
            if (selectedRegisterStorages.has(storage)) {
                selectedRegisterStorages.delete(storage);
                chip.setAttribute("aria-pressed", "false");
            } else {
                selectedRegisterStorages.add(storage);
                chip.setAttribute("aria-pressed", "true");
            }
            updateStorageSelectionInfo();
        });
        storagePalette.appendChild(chip);
    });
}

/* ============================================================
   Secao 4: Banco externo + local
============================================================ */
function loadLocalCatalog() {
    try {
        const saved = localStorage.getItem(storageKey);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function loadBaseCatalog() {
    try {
        const apiResponse = await fetch("/api/models", { cache: "no-store" });
        if (apiResponse.ok) {
            const apiParsed = await apiResponse.json();
            return Array.isArray(apiParsed) ? apiParsed : [];
        }
    } catch {
        // fallback para arquivo estatico
    }

    try {
        const response = await fetch("./models.json", { cache: "no-store" });
        if (!response.ok) return [];
        const parsed = await response.json();
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

async function saveCatalog() {
    localStorage.setItem(storageKey, JSON.stringify(modelCatalog));
    try {
        await fetch("/api/models", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(modelCatalog)
        });
    } catch {
        // sem backend ativo, fica salvo localmente no navegador
    }
}

function mergeCatalog(baseCatalog, localCatalog) {
    const mergedByCode = new Map();

    function addItem(item) {
        if (!item || !Array.isArray(item.codes)) return;
        const normalizedCodes = item.codes
            .map((code) => String(code).trim().toUpperCase())
            .filter(Boolean);
        if (normalizedCodes.length === 0) return;

        const colors = normalizeColorNames(item.color);
        const storages = normalizeStorageValues(item.storage);
        const photos = normalizePhotoUrls(item.photos);
        for (const code of normalizedCodes) {
            const current = mergedByCode.get(code);
            const mergedColors = [...new Set([...(current?.color || []), ...colors])];
            const mergedStorages = [...new Set([...(current?.storage || []), ...storages])];
            const mergedPhotos = [...new Set([...(current?.photos || []), ...photos])];

            mergedByCode.set(code, {
                codes: [code],
                name: item.name || current?.name || "Modelo desconhecido",
                color: mergedColors.length ? mergedColors : ["Desconhecida"],
                storage: mergedStorages.length ? mergedStorages : ["Desconhecido"],
                photos: mergedPhotos
            });
        }
    }

    baseCatalog.forEach(addItem);
    localCatalog.forEach(addItem);

    return Array.from(mergedByCode.values());
}

let modelCatalog = [];

/* ============================================================
   Secao 5: Parsing
============================================================ */
function parseTechnicalCode(fullCode) {
    const normalized = fullCode.trim().toUpperCase();
    const match = normalized.match(regexModel);
    if (!match) return null;
    const [, typeCode, innerCode, countryCode, sulfixCode] = match;
    return { normalized, typeCode, innerCode, countryCode, sulfixCode: sulfixCode || "-" };
}

function parseAnyModelCode(rawValue) {
    const normalized = rawValue.trim().toUpperCase();
    if (!normalized) return null;

    const fullParsed = parseTechnicalCode(normalized);
    if (fullParsed) return { kind: "full", normalized, parsed: fullParsed, innerCode: fullParsed.innerCode };

    const typedInnerMatch = normalized.match(typedInnerRegex);
    if (typedInnerMatch) {
        const [, typeCode, innerCode] = typedInnerMatch;
        return { kind: "typedInner", normalized, parsed: null, innerCode, typeCode };
    }

    if (innerCodeRegex.test(normalized)) {
        return { kind: "inner", normalized, parsed: null, innerCode: normalized };
    }
    return null;
}

function splitCodeFragments(rawValue) {
    const normalized = String(rawValue || "").trim().toUpperCase().replace(/\s+/g, "");
    const slashIndex = normalized.indexOf("/");
    const base = slashIndex >= 0 ? normalized.slice(0, slashIndex) : normalized;
    const suffix = slashIndex >= 0 ? normalized.slice(slashIndex) : "";

    let remaining = base;
    let type = "";
    let country = "";
    if (remaining && "MNPF".includes(remaining[0])) {
        type = remaining[0];
        remaining = remaining.slice(1);
    }
    for (const code of countryCodes) {
        if (remaining.endsWith(code)) {
            country = code;
            remaining = remaining.slice(0, -2);
            break;
        }
    }
    return { type, middle: remaining, country, suffix };
}

function composeCodeFromDropdowns() {
    const parts = splitCodeFragments(registerFullCode.value);
    const chosenType = registerType.value || parts.type;
    const chosenCountry = registerCountry.value || parts.country;

    let rebuilt = "";
    if (chosenType) rebuilt += chosenType;
    if (parts.middle) rebuilt += parts.middle;
    if (chosenCountry) rebuilt += chosenCountry;
    if (parts.suffix) rebuilt += parts.suffix;
    registerFullCode.value = rebuilt;
    syncRegisterFromCode();
}

/* ============================================================
   Secao 6: Consulta
============================================================ */
function buildResult(fullCode) {
    const parsed = parseTechnicalCode(fullCode);
    if (!parsed) return null;
    const found = modelCatalog.find((item) => item.codes.includes(parsed.innerCode));

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
    colorSwatchesOutput.innerHTML = "";
    modelPhotosOutput.innerHTML = "";
}

checkBtn.addEventListener("click", () => {
    const fullCode = modelInput.value.trim().toUpperCase();
    invalidOutput.textContent = "";

    if (!fullCode) {
        invalidOutput.textContent = "Por favor, insira um modelo valido.";
        clearOutputs();
        modalContainer.style.display = "block";
        return;
    }

    const result = buildResult(fullCode);
    if (!result) {
        invalidOutput.textContent = "Formato invalido. Exemplo: MLPF3BR/A";
        clearOutputs();
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

/* ============================================================
   Secao 7: Cadastro
============================================================ */
addInfoBtn.addEventListener("click", () => {
    registerMessage.textContent = "";
    registerForm.reset();
    setRegisterSelectedColors([]);
    setRegisterSelectedStorages([]);
    registerModal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
    modalContainer.style.display = "none";
});

registerCloseBtn.addEventListener("click", () => {
    registerModal.style.display = "none";
});

function syncRegisterFromCode() {
    const parsedInput = parseAnyModelCode(registerFullCode.value);
    if (!registerFullCode.value.trim()) {
        registerMessage.textContent = "";
        return;
    }

    if (!parsedInput) {
        const parts = splitCodeFragments(registerFullCode.value);
        if (parts.type && !registerType.value) registerType.value = parts.type;
        if (parts.country && !registerCountry.value) registerCountry.value = parts.country;
        registerMessage.textContent = "Voce pode continuar montando o codigo (tipo + meio + pais).";
        return;
    }

    if (parsedInput.kind === "full") {
        registerCountry.value = parsedInput.parsed.countryCode;
        registerType.value = parsedInput.parsed.typeCode;
    } else if (parsedInput.kind === "typedInner") {
        registerCountry.value = "";
        registerType.value = parsedInput.typeCode;
    } else {
        registerCountry.value = "";
        registerType.value = "";
    }

    const existing = modelCatalog.find((item) => item.codes.includes(parsedInput.innerCode));
    if (existing) {
        registerModelName.value = existing.name;
        registerPhotos.value = normalizePhotoUrls(existing.photos).join(", ");
        setRegisterSelectedColors(existing.color);
        setRegisterSelectedStorages(existing.storage);
        registerMessage.textContent = "Modelo reconhecido: campos preenchidos automaticamente.";
    } else {
        if (parsedInput.kind === "full") {
            registerMessage.textContent = "Codigo completo valido, mas sem cadastro. Para cadastrar, use o codigo do meio.";
        } else {
            registerMessage.textContent = "Codigo valido. Preencha os campos e salve.";
        }
        registerPhotos.value = "";
        setRegisterSelectedColors([]);
        setRegisterSelectedStorages([]);
    }
}

registerFullCode.addEventListener("input", syncRegisterFromCode);

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const parsedInput = parseAnyModelCode(registerFullCode.value);
    const modelName = registerModelName.value.trim();
    const selectedStorages = Array.from(selectedRegisterStorages);
    const selectedPhotos = normalizePhotoUrls(registerPhotos.value);
    const countryCode = registerCountry.value;
    const typeCode = registerType.value;
    const selectedColors = Array.from(selectedRegisterColors);

    if (!parsedInput) {
        registerMessage.textContent = "Use codigo completo (MLPF3BR/A) ou codigo do meio (LPF3/MLQ63).";
        return;
    }

    if (parsedInput.kind === "full") {
        const existing = modelCatalog.find((item) => item.codes.includes(parsedInput.innerCode));
        if (existing) {
            registerModelName.value = existing.name;
            registerPhotos.value = normalizePhotoUrls(existing.photos).join(", ");
            setRegisterSelectedColors(existing.color);
            setRegisterSelectedStorages(existing.storage);
            registerCountry.value = parsedInput.parsed.countryCode;
            registerType.value = parsedInput.parsed.typeCode;
            registerMessage.textContent = "Codigo completo apenas preenche. Para cadastrar, use o codigo do meio.";
        } else {
            registerMessage.textContent = "Codigo completo sem cadastro. Para cadastrar, use o codigo do meio.";
        }
        return;
    }

    if (!modelName || selectedStorages.length === 0 || selectedColors.length === 0) {
        registerMessage.textContent = "Nao e permitido cadastrar sem nome, armazenamento e pelo menos uma cor.";
        return;
    }

    if (parsedInput.kind === "typedInner") {
        registerCountry.value = "";
        registerType.value = parsedInput.typeCode;
        if (typeCode && typeCode !== parsedInput.typeCode) {
            registerMessage.textContent = "O tipo deve seguir o prefixo do codigo (M/N/F/P).";
            return;
        }
    }

    if (parsedInput.kind === "inner" && (countryCode || typeCode)) {
        registerMessage.textContent = "Pais e tipo sao usados apenas para leitura de codigo completo.";
    }

    const existing = modelCatalog.find((item) => item.codes.includes(parsedInput.innerCode));
    if (existing) {
        existing.name = modelName;
        existing.color = [...new Set([...normalizeColorNames(existing.color), ...selectedColors])];
        existing.storage = [...new Set([...normalizeStorageValues(existing.storage), ...selectedStorages])];
        existing.photos = [...new Set([...normalizePhotoUrls(existing.photos), ...selectedPhotos])];
    } else {
        modelCatalog.push({
            codes: [parsedInput.innerCode],
            name: modelName,
            color: selectedColors,
            storage: selectedStorages,
            photos: selectedPhotos
        });
    }

    await saveCatalog();
    registerMessage.textContent = "Cadastro salvo com sucesso.";
});

registerCountry.addEventListener("change", composeCodeFromDropdowns);
registerType.addEventListener("change", composeCodeFromDropdowns);

/* ============================================================
   Secao 8: Tema e inicializacao
============================================================ */
darkMode.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", darkMode.checked);
});

async function initCatalog() {
    buildColorPalette();
    buildStoragePalette();
    setRegisterSelectedColors([]);
    setRegisterSelectedStorages([]);
    const [baseCatalog, localCatalog] = await Promise.all([
        loadBaseCatalog(),
        Promise.resolve(loadLocalCatalog())
    ]);
    modelCatalog = mergeCatalog(baseCatalog, localCatalog);
}

initCatalog();
