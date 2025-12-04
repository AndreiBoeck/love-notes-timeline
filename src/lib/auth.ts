const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN as string;
const COGNITO_CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID as string;
const COGNITO_REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI as string;

const TOKEN_KEY = "access_token";

export function getAccessToken() {
    return localStorage.getItem(TOKEN_KEY) || null;
}

export function isLoggedIn() {
    return !!getAccessToken();
}

export function buildLoginUrl() {
    const base = `${COGNITO_DOMAIN}/login`;
    const params = new URLSearchParams({
        client_id: COGNITO_CLIENT_ID,
        response_type: "token",
        scope: "openid email",
        redirect_uri: COGNITO_REDIRECT_URI,
    });


    return `${base}?${params.toString()}`;
}

export function saveTokenFromHash(hash: string) {
    const clean = hash.startsWith("#") ? hash.substring(1) : hash;
    const params = new URLSearchParams(clean);

    const accessToken = params.get("access_token");
    const idToken = params.get("id_token");

    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
    if (idToken) localStorage.setItem("id_token", idToken);
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("id_token");
}
