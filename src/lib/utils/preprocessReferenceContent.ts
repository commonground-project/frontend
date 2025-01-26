export type preprocessReferenceContentParams = {
    content: string;
};

export type typedContentFragment = {
    type: "content" | "reference";
    text: string;
    references: number[] | null;
};

export type preprocessedContentFragments = typedContentFragment[][]; // first index is paragraph, second index is the content/reference in the paragraph

export function preprocessReferenceContent({
    content,
}: preprocessReferenceContentParams): preprocessedContentFragments {
    const regex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const parsedContents: preprocessedContentFragments = [];

    let lastIndex = 0;
    let match;
    const result: typedContentFragment[] = [];

    while ((match = regex.exec(content)) !== null) {
        // Push normal text before the reference
        if (lastIndex < match.index) {
            result.push({
                type: "content",
                text: content.slice(lastIndex, match.index),
                references: null,
            });
        }
        let referenceText = match[1];
        const references: number[] = [];
        match[2].split(",").map((num) => {
            // Push the reference text
            referenceText = referenceText + `[${Number(num) + 1}]`;
            // record the reference
            if (references.find((ref) => ref === Number(num)) === undefined)
                references.push(Number(num));
        });
        result.push({
            type: "reference",
            text: referenceText,
            references: references,
        });

        // Update the lastIndex to the end of the current match
        lastIndex = regex.lastIndex;
    }

    // Push remaining text after the last reference
    if (lastIndex < content.length) {
        result.push({
            type: "content",
            text: content.slice(lastIndex),
            references: null,
        });
    }

    // Check if some text includes new line
    // If so, split the text and push them separately to different paragraphs
    parsedContents.push([]);

    result.forEach((contentObject) => {
        const splitText = contentObject.text.split("\n");

        if (splitText.length > 1) {
            splitText.forEach((text, index) => {
                parsedContents[parsedContents.length - 1].push({
                    type: contentObject.type,
                    text,
                    references: contentObject.references,
                });
                if (index !== splitText.length - 1) {
                    parsedContents.push([]);
                }
            });
        } else {
            parsedContents[parsedContents.length - 1].push(contentObject);
        }
    });

    return parsedContents;
}
