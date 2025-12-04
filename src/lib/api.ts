// src/lib/api.ts

// Lê a base da API do .env
const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;

if (!API_BASE) {
    console.error(
        "[API] VITE_API_BASE não está definido. Coloque no .env algo como:",
        'VITE_API_BASE="https://2gn7ta94ac.execute-api.us-east-2.amazonaws.com"'
    );
}

// Se você usar outro nome de chave no localStorage, ajusta aqui:
function getAccessToken(): string | null {
    return localStorage.getItem("access_token");
}

// Monta URL absoluta bonitinha
function buildUrl(path: string): string {
    const base = (API_BASE || "").replace(/\/$/, ""); // remove barra final
    const p = path.startsWith("/") ? path : `/${path}`;
    return `${base}${p}`;
}

async function apiFetch(path: string, options: RequestInit = {}) {
    const token = getAccessToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    } else {
        console.warn("[API] Chamando API sem access_token. Vai tomar 401, bb.");
    }

    const url = buildUrl(path);
    console.log("[API] Fetch:", url, options);

    let res: Response;
    try {
        res = await fetch(url, {
            ...options,
            headers,
        });
    } catch (err) {
        console.error("[API] Falha de rede / CORS em fetch:", err);
        throw err; // isso que vira o TypeError: Failed to fetch lá no AddEntry
    }

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("[API] Erro HTTP:", res.status, text);
        throw new Error(text || `Erro na API (${res.status})`);
    }

    if (res.status === 204) return null;

    return res.json();
}

// ------------------ Tipos ------------------

export interface Memory {
    userId: string;
    id: string;
    title: string;
    description: string;
    fileKey?: string;      // legado
    fileKeys?: string[];   // novo formato
    memoryDate: string;    // "yyyy-MM-dd"
    memoryDateIso?: string;
    createdAt: string;
    updatedAt: string;
}

// ------------------ Funções públicas ------------------

export async function listMemories(): Promise<Memory[]> {
    return apiFetch("/memories", {
        method: "GET",
    });
}

export async function createMemory(input: {
    title: string;
    description: string;
    fileKeys: string[];
    memoryDate: string;
}): Promise<Memory> {
    console.log("[API] createMemory payload:", input);
    return apiFetch("/memories", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export async function getPresignedUrl(params: {
    filename: string;
    contentType: string;
}): Promise<{ uploadUrl: string; fileKey: string }> {
    console.log("[API] getPresignedUrl params:", params);
    return apiFetch("/files/presign", {
        method: "POST",
        body: JSON.stringify(params),
    });
}

export async function uploadFileToPresignedUrl(
    uploadUrl: string,
    file: File
) {
    console.log("[API] uploadFileToPresignedUrl →", uploadUrl, file.name);

    const res = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type || "application/octet-stream",
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Erro no upload S3:", res.status, text);
        throw new Error("Erro ao enviar arquivo para o armazenamento.");
    }
}
