export function safeConstructURL(url: string): URL {
    let pageURL: URL;
    try {
        pageURL = new URL(decodeURI(url));
    } catch (e) {
        if (e instanceof URIError) {
            console.error("Invalid URI:", e.message);
        } else {
            console.error("Unexpected error:", e);
        }
        pageURL = new URL("https://example.com");
    }
    return pageURL;
}
