const API_BASE = import.meta.env.VITE_API_BASE as string;

function getAccessToken(): string | null {
    return localStorage.getItem("access_token");
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
        console.warn("Chamando API sem access_token. Isso vai dar 401, ein bb.");
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Erro na API:", res.status, text);
        throw new Error(text || `Erro na API (${res.status})`);
    }

    if (res.status === 204) return null;

    return res.json();
}

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
    return apiFetch("/memories", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export async function getPresignedUrl(params: {
    filename: string;
    contentType: string;
}): Promise<{ uploadUrl: string; fileKey: string }> {
    return apiFetch("/files/presign", {
        method: "POST",
        body: JSON.stringify(params),
    });
}

export async function uploadFileToPresignedUrl(
    uploadUrl: string,
    file: File
) {
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
