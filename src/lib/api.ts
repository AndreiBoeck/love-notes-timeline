const API_BASE = import.meta.env.VITE_API_BASE as string;

// Se você salvou o token no localStorage com essa key.
// (na callback do Cognito, por exemplo)
function getAccessToken() {
    return localStorage.getItem("access_token");
}

async function apiFetch(path: string, options: RequestInit = {}) {
    const token = getAccessToken();

    const headers: HeadersInit = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erro na API (${res.status}): ${text}`);
    }

    // algumas rotas podem não ter body (ex: DELETE 204)
    if (res.status === 204) return null;
    return res.json();
}

// Tipos que combinam com o back (DynamoDB MemoryItem)
export interface Memory {
    userId: string;
    id: string;
    title: string;
    description: string;
    fileKey: string;
    memoryDate: string; // ISO
    createdAt: string;
    updatedAt: string;
}

// GET /memories
export async function listMemories(): Promise<Memory[]> {
    return apiFetch("/memories", {
        method: "GET",
    });
}

// POST /memories
export async function createMemory(input: {
    title: string;
    description?: string;
    fileKey: string;
    memoryDate: string; // ISO string vinda do date.toISOString()
}) {
    return apiFetch("/memories", {
        method: "POST",
        body: JSON.stringify({
            title: input.title,
            description: input.description ?? "",
            fileKey: input.fileKey,
            memoryDate: input.memoryDate,
        }),
    });
}

// POST /files/presign
export async function getPresignedUrl(params: {
    filename: string;
    contentType: string;
}): Promise<{ uploadUrl: string; fileKey: string }> {
    return apiFetch("/files/presign", {
        method: "POST",
        body: JSON.stringify(params),
    });
}

// Upload direto pro S3
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
        const text = await res.text();
        throw new Error(`Erro no upload S3 (${res.status}): ${text}`);
    }
}
