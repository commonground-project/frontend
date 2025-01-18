export type preprocessReferenceContentParams = {
    content: string;
};

export type preprocessedContent = {
    type: "content" | "reference";
    text: string;
}[][];

export function preprocessReferenceContent({
    content,
}: preprocessReferenceContentParams): preprocessedContent {
    const regex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const parsedContents: preprocessedContent = [];

    content.split("\n").map((paragraph) => {
        let lastIndex = 0;
        let match;
        const result: { type: "content" | "reference"; text: string }[] = [];

        while ((match = regex.exec(paragraph)) !== null) {
            // Push normal text before the reference
            if (lastIndex < match.index) {
                result.push({
                    type: "content",
                    text: paragraph.slice(lastIndex, match.index),
                });
            }
            let referenceText = match[1];
            match[2].split(",").map((num) => {
                // Push the reference text
                referenceText = referenceText + `[${Number(num) + 1}]`;
            });
            result.push({ type: "reference", text: referenceText });

            // Update the lastIndex to the end of the current match
            lastIndex = regex.lastIndex;
        }

        // Push remaining text after the last reference
        if (lastIndex < paragraph.length) {
            result.push({
                type: "content",
                text: paragraph.slice(lastIndex),
            });
        }
        parsedContents.push(result);
    });

    return parsedContents;
}
