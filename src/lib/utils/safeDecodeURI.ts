export function safeDecodeURI(uri: string): string | null {
    try {
        return decodeURI(uri);
    } catch (e) {
        if (e instanceof URIError) {
            console.error("Invalid URI:", e.message);
        } else {
            console.error("Unexpected error:", e);
        }
        return null; // Return null to indicate failure
    }
}
