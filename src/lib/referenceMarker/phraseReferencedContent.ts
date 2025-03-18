// Change the reference marker in the editor to flat text and fit the backend format
function extractReferenceCounter(referenceCounter: string): number[] {
    const referenceIndexes = Array.from(
        referenceCounter.matchAll(/\[(\d+)\]/g),
        (match) => parseInt(match[1]) - 1,
    );
    return referenceIndexes;
}

function treeWalker_referenceText(
    node: Node,
    isToplevel: boolean = false,
): string {
    // DFS
    // Edge case: text node
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent ?? "";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        // Edge case: reference marker start
        if (
            element.classList.contains("reference-marker") &&
            element.classList.contains("start")
        ) {
            return "[";
        }
        // Edge case: reference counter
        else if (element.classList.contains("reference-counter")) {
            const referenceIndexes = extractReferenceCounter(
                element.textContent ?? "",
            );
            //end the reference here
            return `](${referenceIndexes.join(",")})`;
        }
        // Edge case: reference marker end
        else if (
            element.classList.contains("reference-marker") &&
            element.classList.contains("end")
        ) {
            return "";
        }
    }

    let firstChild = true;
    let str = "";
    node.childNodes.forEach((child) => {
        if (firstChild) firstChild = false;
        else if (
            isToplevel &&
            !firstChild &&
            (child as HTMLElement).tagName === "DIV"
        ) {
            str += "\n";
        }
        str += treeWalker_referenceText(child);
    });
    return str; // return only the add on content
}

function treeWalker_pureText(node: Node, isToplevel: boolean = false): string {
    // DFS
    // Edge case: text node
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent ?? "";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        // Edge case: reference counter
        if (element.classList.contains("reference-counter")) {
            return "";
        }
    }

    let firstChild = true;
    let str = "";
    node.childNodes.forEach((child) => {
        if (firstChild) firstChild = false;
        else if (
            isToplevel &&
            !firstChild &&
            (child as HTMLElement).tagName === "DIV"
        ) {
            str += "\n";
        }
        str += treeWalker_pureText(child);
    });
    return str; // return only the add on content
}

// This function is used to extract the referenced content from the editor to be sent to the backend in string format
export function phraseReferencedContent(toplevelContainer: HTMLElement) {
    const resultContent = treeWalker_referenceText(toplevelContainer, true);
    return resultContent;
}

// extract the pure text from the editor (without reference markers)
export function extractPureText(toplevelContainer: HTMLElement) {
    const resultContent = treeWalker_pureText(toplevelContainer, true);
    return resultContent;
}
