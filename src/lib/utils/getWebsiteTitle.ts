export async function getWebsiteTitle(url: string): Promise<string> {
    try {
        // Fetch the webpage content
        const response = await fetch(
            `https://cors-anywhere.herokuapp.com/${url}`,
        );
        const html = await response.text();

        // Create a temporary DOM to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Extract the title
        const title = doc.querySelector("title")?.textContent;

        if (title) {
            return title;
        }
        return "無法取得網頁標題";
    } catch (err) {
        throw new Error("Failed to fetch website");
    }
}
