// Define the funciton to do the dom operations
// to add, remove, and update suggestion markers, and highlights

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
    highlightWrapper.className = "sug-highlight-wrapper";
    highlightWrapper.style.textDecoration = "underline";
    highlightWrapper.style.textDecorationColor = "#FF0000";
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

type encapsuleSuggestionParams = {
    range: Range;
    suggestionId: string;
};

// Generate a suggestion marker element to mark the start or end of a suggestion
function generateSuggestionMarker({
    id,
    type,
}: {
    id: string;
    type: "start" | "end";
}) {
    const SuggestionMarkerElement = document.createElement("span");
    SuggestionMarkerElement.dataset.markerId = id;
    SuggestionMarkerElement.className = `suggestion-marker ${type}`;
    SuggestionMarkerElement.style.display = "none";
    SuggestionMarkerElement.contentEditable = "false";

    return SuggestionMarkerElement;
}

// Encapsule (surround) a range of text with a suggestion marker
export function encapsuleSuggestionMarker({
    range,
    suggestionId,
}: encapsuleSuggestionParams) {
    // Check if the suggestion marker already exists
    const suggestionMarkers = document.querySelectorAll(
        `[data-marker-id="${suggestionId}"].suggestion-marker`,
    );
    if (suggestionMarkers.length > 0) {
        console.error(`suggestion marker of id=${suggestionId} already exists`);
        return;
    }

    // Create the element to insert at the start of the range
    const startElement = generateSuggestionMarker({
        id: suggestionId,
        type: "start",
    });

    // Create the element to insert at the end of the range
    const endElement = generateSuggestionMarker({
        id: suggestionId,
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
    const suggestionMarkerRange = new Range();
    suggestionMarkerRange.setStartAfter(startElement);
    suggestionMarkerRange.setEndBefore(endElement);
    highlightTextInRange(suggestionMarkerRange);
}

// Decapsule (remove) a suggestion marker from the text
type decapsuleSuggestionMarkerParams = {
    suggestionId: string;
};

export function decapsuleSuggestionMarkerParams({
    suggestionId,
}: decapsuleSuggestionMarkerParams) {
    console.log("decapsuleSuggestionMarker", suggestionId);

    // Find every suggestion marker
    const suggestionMarkers = document.querySelectorAll(
        `[data-marker-id="${suggestionId}"].suggestion-marker`,
    );
    if (suggestionMarkers.length === 0) {
        console.error(
            `start or end suggestion marker of id ${suggestionId} not found`,
        );
        return;
    }

    // Dehighlight the text between the suggestion markers
    const highlightedRange = new Range();
    highlightedRange.setStartAfter(suggestionMarkers[0]); // Start after the start marker
    highlightedRange.setEndBefore(suggestionMarkers[1]); // End before the end marker
    dehighlightTextInRange(highlightedRange);

    // Delete every suggestion markers
    suggestionMarkers.forEach((marker) => marker.remove());
}

export function removeAllSuggestionMarkers() {
    console.log("removeAllSuggestionMarkers");

    // Find every suggestion marker
    const suggestionMarkers = document.querySelectorAll(`.suggestion-marker`);

    // Dehighlight the text between the suggestion markers
    console.log("suggestion markers", suggestionMarkers);
    for (let i = 0; i < suggestionMarkers.length; i += 2) {
        console.log("i", i);
        const highlightedRange = new Range();
        highlightedRange.setStartAfter(suggestionMarkers[i] as Node); // Start after the start marker
        highlightedRange.setEndBefore(suggestionMarkers[i + 1] as Node); // End before the end marker
        dehighlightTextInRange(highlightedRange);
    }

    // Delete every suggestion markers
    suggestionMarkers.forEach((marker) => marker.remove());
}

export function setRangeByTextOffset(
    container: Node,
    startOffset: number,
    endOffset: number,
) {
    const range = document.createRange();
    const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
    );

    let currentNode = walker.nextNode();
    let currentOffset = 0;

    let startNode = null,
        startNodeOffset = 0;
    let endNode = null,
        endNodeOffset = 0;

    while (currentNode) {
        const textLength = currentNode.nodeValue
            ? currentNode.nodeValue.length
            : 0;

        // Find start position
        if (!startNode && currentOffset + textLength >= startOffset) {
            startNode = currentNode;
            startNodeOffset = startOffset - currentOffset;
        }

        // Find end position
        if (!endNode && currentOffset + textLength >= endOffset) {
            endNode = currentNode;
            endNodeOffset = endOffset - currentOffset;
            break;
        }

        currentOffset += textLength;
        currentNode = walker.nextNode();
    }

    if (startNode && endNode) {
        range.setStart(startNode, startNodeOffset);
        range.setEnd(endNode, endNodeOffset);
        return range;
    } else {
        console.warn("Could not set range - offsets out of bounds.");
        return null;
    }
}
