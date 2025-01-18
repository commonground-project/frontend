export type paragraphReferences = number[][];

export type getParagraphReferencesParams = {
    content: string;
};

export function getParagraphReferences({
    content,
}: getParagraphReferencesParams): paragraphReferences {
    const regex = /\[([^\]]+)\]\(([^\)]+)\)/g;
    const allReferences: paragraphReferences = [];

    content.split("\n").map((paragraph) => {
        let match;
        const references: number[] = [];

        while ((match = regex.exec(paragraph)) !== null) {
            match[2].split(",").map((num) => {
                // record the reference
                if (references.find((ref) => ref === Number(num)) === undefined)
                    references.push(Number(num));
            });
        }
        allReferences.push(references);
    });

    return allReferences;
}
