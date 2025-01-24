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
    //find every reference marker and reference counter with the same id
    const referenceMarkers = document.querySelectorAll(
        `#\\3${referenceMarkerId.split("").join(" ")}.reference-marker`,
    );
    const referenceCounters = document.querySelectorAll(
        `#\\3${referenceMarkerId.split("").join(" ")}.reference-counter`,
    );
    referenceMarkers.forEach((marker) => marker.remove());
    referenceCounters.forEach((counter) => counter.remove());
}
