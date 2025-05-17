export function safeConstructURL(url: string): URL | null {
    let pageURL: URL | null;
    try {
        pageURL = new URL(decodeURI(url));
    } catch (e) {
        if (e instanceof URIError) {
            console.error("Invalid URI:", e.message);
        } else {
            console.error("Unexpected error:", e);
        }
        pageURL = null;
    }
    return pageURL;
}
