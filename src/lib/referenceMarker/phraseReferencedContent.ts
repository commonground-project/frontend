// Change the reference marker in the editor to flat text and fit the backend format
function extractReferenceCounter(referenceCounter: string): number[] {
    const referenceIndexes = Array.from(
        referenceCounter.matchAll(/\[(\d+)\]/g),
        (match) => parseInt(match[1]) - 1,
    );
    return referenceIndexes;
}

export function treeWalker_referenceText(
    node: Node,
    isToplevel: boolean = false,
): string {
    // DFS
    // Edge case: text node
    if (node.nodeType === Node.TEXT_NODE) {
        console.log("text node");
        return node.textContent ?? "";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;

        // Edge case: placeholder, ignore it
        if (element.id === "placeholder") {
            console.log("placeholder");
            return "";
        }

        // Edge case: reference marker start
        else if (
            element.classList.contains("reference-marker") &&
            element.classList.contains("start")
        ) {
            console.log("reference marker start");
            return "[";
        }

        // Edge case: reference counter
        else if (element.classList.contains("reference-counter")) {
            console.log("reference counter");
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
            console.log("reference marker end");
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
