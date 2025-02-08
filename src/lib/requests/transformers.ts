import { type KnownErrorResponse } from "@/types/requests.types";

export async function parseJsonWhileHandlingErrors(
    response: Response,
): Promise<any> {
    if (response.ok) {
        const responseText = await response.text();
        if (!responseText) return {};
        return JSON.parse(responseText);
    }

    let errorResponse: KnownErrorResponse | null = null;
    try {
        errorResponse = await response.json();
    } catch {}
    if (errorResponse) throw errorResponse;
    throw new Error(
        `Unknown error while fetching ${response.url}: ${response.status} ${response.statusText}`,
    );
}
