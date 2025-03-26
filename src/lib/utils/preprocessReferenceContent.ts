export type preprocessReferenceContentParams = {
    content: string;
};

export type TypedContentFragment = {
    type:
        | "Content" // plain text
        | "Reference" // text of the reference, highlighted
        | "ReferenceStart" // start of the reference, invisible
        | "ReferenceEnd" // end of the reference, invisible
        | "ReferenceCounter"; // counter of the reference, highlighted
    text: string;
    references: number[] | null;
};

export type preprocessedContentFragments = TypedContentFragment[][]; // first index is paragraph, second index is the content/reference in the paragraph

// turn the content in backend format (markdown like) to frontend format (with references markers)
export function preprocessReferenceContent({
    content,
}: preprocessReferenceContentParams): preprocessedContentFragments {
    const regex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const parsedContents: preprocessedContentFragments = [];

    let lastIndex = 0;
    let match;
    const result: TypedContentFragment[] = [];

    while ((match = regex.exec(content)) !== null) {
        // Push normal text before the reference
        if (lastIndex < match.index) {
            result.push({
                type: "Content",
                text: content.slice(lastIndex, match.index),
                references: null,
            });
        }
        const referenceText = match[1];
        let referenceCounter = "";
        const references: number[] = [];
        match[2].split(",").map((num) => {
            // Push the reference text
            referenceCounter += `[${Number(num) + 1}]`;
            // record the reference
            if (references.find((ref) => ref === Number(num)) === undefined)
                references.push(Number(num));
        });

        // Push the reference with start and end markers for further styling and hydration
        result.push(
            {
                type: "ReferenceStart",
                text: "",
                references: null,
            },
            {
                type: "Reference",
                text: referenceText,
                references: references,
            },
            {
                type: "ReferenceCounter",
                text: referenceCounter,
                references: references,
            },
            {
                type: "ReferenceEnd",
                text: "",
                references: null,
            },
        );

        // Update the lastIndex to the end of the current match
        lastIndex = regex.lastIndex;
    }

    // Push remaining text after the last reference
    if (lastIndex < content.length) {
        result.push({
            type: "Content",
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
                    references: index == 0 ? contentObject.references : null,
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
