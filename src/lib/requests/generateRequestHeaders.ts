export function generateRequestHeaders(auth_token?: string): HeadersInit {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
    };

    if (auth_token) {
        headers.Authorization = `Bearer ${auth_token}`;
    }

    return headers;
}
