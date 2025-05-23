// Define the funciton to do the dom operations
// to add, remove, and update reference markers, reference counters, and highlights

// Add highlight to a range of text
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

// Remove highlight from a range of text
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
        if (
            walker.currentNode.parentNode?.nodeName !== "DIV" &&
            walker.currentNode.nodeType === Node.TEXT_NODE
        ) {
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

// Generate a reference marker element to mark the start or end of a reference
export function generateReferenceMarker({
    id,
    type,
}: {
    id: string;
    type: "start" | "end";
}) {
    const ReferenceMarkerElement = document.createElement("span");
    ReferenceMarkerElement.dataset.markerId = id;
    ReferenceMarkerElement.className = `reference-marker ${type}`;
    ReferenceMarkerElement.style.display = "none";
    ReferenceMarkerElement.contentEditable = "false";

    return ReferenceMarkerElement;
}

export function generateReferenceCounter({
    id,
    referencedIndexes,
}: {
    id: string;
    referencedIndexes: number[];
}) {
    const referenceCounter = document.createElement("span");
    referenceCounter.className = "reference-counter";
    referenceCounter.style.color = "#10B981";
    referenceCounter.contentEditable = "false";
    referenceCounter.dataset.markerId = id;
    referenceCounter.innerText =
        " " + referencedIndexes.map((num) => `[${num + 1}]`).join("");

    return referenceCounter;
}

// Encapsule (surround) a range of text with a reference marker
export function encapsuleReferenceMarker({
    range,
    referencedIndexes,
    referenceMarkerId,
}: encapsuleReferenceMarkerParams) {
    // Check if the reference marker already exists
    const referenceMarkers = document.querySelectorAll(
        `[data-marker-id="${referenceMarkerId}"].reference-marker`,
    );
    if (referenceMarkers.length > 0) {
        console.error(
            `reference marker of id=${referenceMarkerId} already exists`,
        );
        return;
    }

    // Create the element to insert at the start of the range
    const startElement = generateReferenceMarker({
        id: referenceMarkerId,
        type: "start",
    });

    // Create the element to insert at the end of the range
    const endElement = generateReferenceMarker({
        id: referenceMarkerId,
        type: "end",
    });

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

// Update the reference counter with the new referenced indexes
type updateReferenceMarkerParams = {
    referenceMarkerId: string;
    referencedIndexes: number[];
};

export function updateReferenceCounter({
    referenceMarkerId,
    referencedIndexes,
}: updateReferenceMarkerParams) {
    // No fact is referencing this marker, remove the reference marker
    if (referencedIndexes.length === 0) {
        decapsuleReferenceMarker({ referenceMarkerId });
        return;
    }

    const referenceCounter = document.querySelector(
        `[data-marker-id="${referenceMarkerId}"].reference-counter`,
    );
    if (referenceCounter) {
        (referenceCounter as HTMLElement).innerText =
            " " + referencedIndexes.map((num) => `[${num + 1}]`).join("");
        return;
    }
    // Reference marker not found, create a new one
    // Find the end reference marker in the document
    const referenceMarkerEnd = document.querySelector(
        `[data-marker-id="${referenceMarkerId}"].reference-marker.end`,
    );
    if (!referenceMarkerEnd) {
        console.error("end reference marker not found");
        return;
    }
    const newReferenceCounter = generateReferenceCounter({
        id: referenceMarkerId,
        referencedIndexes,
    });

    referenceMarkerEnd.parentNode?.insertBefore(
        newReferenceCounter,
        referenceMarkerEnd,
    );
}

// Decapsule (remove) a reference marker from the text
type decapsuleReferenceMarkerParams = {
    referenceMarkerId: string;
};

export function decapsuleReferenceMarker({
    referenceMarkerId,
}: decapsuleReferenceMarkerParams) {
    // Find every reference marker
    const referenceMarkers = document.querySelectorAll(
        `[data-marker-id="${referenceMarkerId}"].reference-marker`,
    );
    if (referenceMarkers.length === 0) {
        console.error(
            `start or end reference marker of id ${referenceMarkerId} not found`,
        );
        return;
    }

    // Find reference counter
    const referenceCounter = document.querySelectorAll(
        `[data-marker-id="${referenceMarkerId}"].reference-counter`,
    );
    if (referenceCounter.length === 0) {
        console.error(`reference counter of id ${referenceMarkerId}not found`);
        return;
    }

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

export function getReferenceMarkerText(referenceMarkerId: string): string {
    const referenceMarkers = document.querySelectorAll(
        `[data-marker-id="${referenceMarkerId}"].reference-marker`,
    );
    if (referenceMarkers.length === 0) {
        console.error(
            `start or end reference marker of id ${referenceMarkerId} not found`,
        );
        return "";
    }
    const referenceCounter = document.querySelectorAll(
        `[data-marker-id="${referenceMarkerId}"].reference-counter`,
    );
    if (referenceCounter.length === 0) {
        console.error(`reference counter of id ${referenceMarkerId} not found`);
        return "";
    }

    const range = new Range();
    range.setStartAfter(referenceMarkers[0]); // Start after the start marker
    range.setEndBefore(referenceCounter[0]); // End before the reference counter
    return range.toString();
}
