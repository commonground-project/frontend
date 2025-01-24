function highlightTextInRange(range: Range) {
    const walker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_ALL,
        {
            acceptNode: (node) =>
                range.intersectsNode(node)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT,
        },
    );
    // Create the highlight wrapper
    const highlightWrapper = document.createElement("span");
    highlightWrapper.className = "highlight-wrapper";
    highlightWrapper.style.color = "#10B981";
    // Wrap the text nodes in the range with the highlight wrapper
    while (walker.nextNode()) {
        // console.log("node");
        if (walker.currentNode.nodeType === Node.TEXT_NODE) {
            // console.log("textNode", walker.currentNode);
            const currentNode = walker.currentNode;
            const wrapperClone = highlightWrapper.cloneNode(
                true,
            ) as HTMLElement;
            currentNode.parentNode?.replaceChild(wrapperClone, currentNode);
            wrapperClone.appendChild(currentNode);
        }
    }
}

function dehighlightTextInRange(range: Range) {
    const walker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_ALL,
        {
            acceptNode: (node) =>
                range.intersectsNode(node)
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT,
        },
    );
    // Move the text nodes out of the highlight wrapper
    while (walker.nextNode()) {
        console.log("node");
        if (
            walker.currentNode.parentNode?.nodeName !== "DIV" &&
            walker.currentNode.nodeType === Node.TEXT_NODE
        ) {
            console.log("textNode", walker.currentNode);
            const parent = walker.currentNode.parentNode;
            if (parent) {
                parent.parentNode?.replaceChild(walker.currentNode, parent);
            }
        }
    }
}

type encapsuleReferenceMarkerParams = {
    range: Range;
    referencedIndexes: number[];
    referenceMarkerId: string;
};

export function encapsuleReferenceMarker({
    range,
    referencedIndexes,
    referenceMarkerId,
}: encapsuleReferenceMarkerParams) {
    // Create the element to insert at the start of the range
    const startElement = document.createElement("span");
    startElement.id = referenceMarkerId;
    startElement.className = "reference-marker start";
    startElement.textContent = "[Start]";
    startElement.contentEditable = "false";
    startElement.style.color = "blue";

    // Create the element to insert at the end of the range
    const endElement = document.createElement("span");
    endElement.id = referenceMarkerId;
    endElement.className = "reference-marker end";
    endElement.textContent = "[End]";
    endElement.contentEditable = "false";
    endElement.style.color = "green";

    // Insert the start element
    range.insertNode(startElement);

    // Adjust the range to account for the new element at the start
    range.setStartAfter(startElement);

    // Insert the end element (must be after adjusting the range)
    range.collapse(false); // Collapse to the end of the range
    range.insertNode(endElement);

    // Highlight the text in the range
    const referenceMarkerRange = new Range();
    referenceMarkerRange.setStartAfter(startElement);
    referenceMarkerRange.setEndBefore(endElement);
    highlightTextInRange(referenceMarkerRange);

    // Create the reference counter
    updateReferenceCounter({ referenceMarkerId, referencedIndexes });
}

type updateReferenceMarkerParams = {
    referenceMarkerId: string;
    referencedIndexes: number[];
};

export function updateReferenceCounter({
    referenceMarkerId,
    referencedIndexes,
}: updateReferenceMarkerParams) {
    console.log("updateReferenceCounter", referenceMarkerId);
    const referenceCounter = document.querySelector(
        `#\\3${referenceMarkerId.split("").join(" ")}.reference-counter`,
    );
    if (referenceCounter) {
        (referenceCounter as HTMLElement).innerText =
            " " + referencedIndexes.map((num) => `[${num + 1}]`).join("");
        return;
    }
    // Reference marker not found, create a new one
    // Find the end reference marker in the document
    const referenceMarkerEnd = document.querySelector(
        `#\\3${referenceMarkerId.split("").join(" ")}.reference-marker.end`,
    );
    if (!referenceMarkerEnd) {
        console.error("end reference marker not found");
        return;
    }
    const newReferenceCounter = document.createElement("span");
    newReferenceCounter.className = "reference-counter";
    newReferenceCounter.style.color = "#10B981";
    newReferenceCounter.contentEditable = "false";
    newReferenceCounter.id = referenceMarkerId;
    newReferenceCounter.innerText =
        " " + referencedIndexes.map((num) => `[${num + 1}]`).join("");

    referenceMarkerEnd.parentNode?.insertBefore(
        newReferenceCounter,
        referenceMarkerEnd,
    );
}

type decapsuleReferenceMarkerParams = {
    referenceMarkerId: string;
};

export function decapsuleReferenceMarker({
    referenceMarkerId,
}: decapsuleReferenceMarkerParams) {
    console.log("decapsuleReferenceMarker", referenceMarkerId);

    // Find every reference marker
    const referenceMarkers = document.querySelectorAll(
        `#\\3${referenceMarkerId.split("").join(" ")}.reference-marker`,
    );

    // Find reference counter
    const referenceCounter = document.querySelectorAll(
        `#\\3${referenceMarkerId.split("").join(" ")}.reference-counter`,
    );

    // Dehighlight the text between the reference markers
    const highlightedRange = new Range();
    highlightedRange.setStartAfter(referenceMarkers[0]); // Start after the start marker
    highlightedRange.setEndBefore(referenceCounter[0]); // End before the reference counter
    dehighlightTextInRange(highlightedRange);

    // Delete every reference marker
    referenceMarkers.forEach((marker) => marker.remove());

    // Delete every reference marker and reference counter
    referenceCounter.forEach((counter) => counter.remove());
}
