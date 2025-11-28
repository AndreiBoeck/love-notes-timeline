// src/lib/api.ts
import { getAccessToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_BASE as string;

if (!API_BASE) {
    console.warn("VITE_API_BASE não definido!");
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
        console.warn("Sem token de acesso ao chamar a API.");
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    // debugzinho gostoso
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Erro na API:", res.status, text);
        throw new Error(
            text || `Erro na API (${res.status}). Verifica a CloudWatch, bb.`
        );
    }

    if (res.status === 204) return null;

    return res.json();
}

export interface Memory {
    userId: string;
    id: string;
    title: string;
    description: string;
    fileKey: string[];
    memoryDate: string;
    createdAt: string;
    updatedAt: string;
}

export async function createMemory(input: {
    title: string;
    description: string;
    fileKey: string[];
    memoryDate: string;
}): Promise<Memory> {
    return apiFetch("/memories", {
        method: "POST",
        body: JSON.stringify(input),
    });
}

export async function listMemories(): Promise<Memory[]> {
    return apiFetch("/memories", {
        method: "GET",
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
        console.error("Erro no upload para S3:", res.status, text);
        throw new Error("Erro ao enviar arquivo para o armazenamento.");
    }
}
