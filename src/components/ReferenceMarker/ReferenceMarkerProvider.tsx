"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    encapsuleReferenceMarker,
    updateReferenceCounter,
} from "@/lib/referenceMarker/referenceMarkerEditors";
import { ReferenceMarkerContext } from "@/lib/referenceMarker/referenceMarkerContext";

export default function ReferenceMarkerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [selectedFacts, setSelectedFacts] = useState<Map<number, number[]>>(
        new Map().set(0, []),
    );
    const [inSelectionMode, setInSelectionMode] = useState<boolean>(false);
    const [curReferenceMarkerId, setCurReferenceMarkerId] = useState<
        number | null
    >(null);
    const [avaliableMarkerId, setAvaliableMarkerId] = useState<number>(0);
    const inputRef = useRef<HTMLDivElement>(null);

    // Setup observer on the input area
    useEffect(() => {
        if (inputRef?.current === null) return;
        // Mutation observer to detect when a <span> is deleted
        const observer = new MutationObserver((mutations) => {
            // Dismiss the manipulation of placeholder
            if (
                mutations.length === 1 &&
                ((mutations[0].addedNodes[0] as HTMLElement)?.id ===
                    "placeholder" ||
                    (mutations[0].removedNodes[0] as HTMLElement)?.id ===
                        "placeholder")
            )
                return;
            // Get the current selection (cursor position)
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;
            const range = selection.getRangeAt(0);

            // Set a countmap, if both start and end markers are removed,
            // then the reference is fully removed, no need to reinsert
            const countMap = new Map<string, Node[]>(); // id -> [start, counter, end]

            mutations.forEach((mutation) => {
                // Handle only the removal of nodes
                if (mutation.removedNodes.length === 0) return;

                // Detect the manual removal of a reference marker or reference counter
                mutation.removedNodes.forEach((node) => {
                    if (
                        node.nodeName === "SPAN" &&
                        ((node as HTMLElement).classList.contains(
                            "reference-marker",
                        ) ||
                            (node as HTMLElement).classList.contains(
                                "reference-counter",
                            ))
                    ) {
                        const id =
                            (node as HTMLElement).getAttribute(
                                "data-marker-id",
                            ) ?? "";

                        if (!countMap.has(id)) countMap.set(id, []);
                        const cloneNode = node.cloneNode(true);
                        countMap.get(id)?.push(cloneNode);
                    }
                });
            });

            countMap.forEach((nodes) => {
                // If both start and end markers are removed, then the reference is fully removed
                if (nodes.length === 3) return;
                // If not all of the markers is removed, reinsert the whole reference
                nodes.forEach((node) => {
                    const newSpan = node.cloneNode(true);
                    range.insertNode(newSpan);
                    range.setStartAfter(newSpan);
                    range.setEndAfter(newSpan);
                });
            });

            selection.removeAllRanges();
            selection.addRange(range);
        });
        observer.observe(inputRef.current, {
            childList: true,
            subtree: true,
        });
        return () => observer.disconnect();
    }, [inputRef]);

    // Setup paste event listener on the input area.
    // Prevent the ecitor from preserving text styles when pasting text from other styles.
    useEffect(() => {
        const handlePaste = (event: ClipboardEvent) => {
            event.preventDefault(); // Stop default paste behavior

            if (!event.clipboardData) return;
            const text = event.clipboardData.getData("text/plain");

            // Insert text at cursor position
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            range.deleteContents(); // Remove selected text if any

            const textNode = document.createTextNode(text);
            range.insertNode(textNode);

            // Move cursor after inserted text
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);
        };

        const editor = inputRef.current;
        if (editor) {
            editor.addEventListener("paste", handlePaste);
        }

        return () => {
            if (editor) {
                editor.removeEventListener("paste", handlePaste);
            }
        };
    }, []);

    // Handle selection change and areas
    // Check whether the selection overlaps with an existing reference marker
    const rangeOverlaps = (
        range: Range,
        startMarker: Node,
        endMarker: Node,
    ) => {
        const referenceMarkerRange = document.createRange();
        referenceMarkerRange.setStart(startMarker, 0);
        referenceMarkerRange.setEnd(endMarker, endMarker.childNodes.length);
        return (
            range.compareBoundaryPoints(
                Range.END_TO_START,
                referenceMarkerRange,
            ) < 0 &&
            range.compareBoundaryPoints(
                Range.START_TO_END,
                referenceMarkerRange,
            ) > 0
        );
    };

    // Get the selected reference marker, which the user wants to update
    const getSelectedReferenceMarker = useCallback((range: Range) => {
        const startMarkers = document.querySelectorAll(
            ".reference-marker.start",
        );
        const endMarkers = document.querySelectorAll(".reference-marker.end");

        let selectedMarkerId: string | null = null;
        if (startMarkers.length > 0) {
            for (let i = 0; i < startMarkers.length; i++) {
                if (rangeOverlaps(range, startMarkers[i], endMarkers[i])) {
                    selectedMarkerId =
                        startMarkers[i].getAttribute("data-marker-id");
                    break;
                }
            }
        }
        return selectedMarkerId;
    }, []);

    // Handle selection change and add tooltip
    const handleSelection = useCallback(() => {
        // Reset selection mode and tooltip no matter what
        // Since they will eventually be added back if a selection is made, it is safe to remove them here first
        // And since React will batch the state updates, calling setInSelectionMode(false) here will not cause the tooltip to flash
        setInSelectionMode(false);
        document.getElementById("fact-hint-tooltip")?.remove();

        // If the current active element is not the content editable div, stop the tooltip from showing
        if (document.activeElement !== inputRef.current) return;

        const selection = window.getSelection();
        if (!selection) return;
        const range = selection.getRangeAt(0);
        if (range.collapsed) return;

        setInSelectionMode(true);

        // Check if the selection overlaps with an existing reference marker
        // If it does, we assume the user wants to update that marker
        const selectedMarkerId = getSelectedReferenceMarker(range);
        setCurReferenceMarkerId(
            selectedMarkerId ? Number(selectedMarkerId) : null,
        );

        // Create tooltip element
        const rangeRect = range.getBoundingClientRect();
        const tooltip = document.createElement("div");
        tooltip.className =
            "absolute bg-blue-600 z-30 text-white text-xs rounded py-1 px-2 opacity-0";
        tooltip.id = "fact-hint-tooltip";
        tooltip.textContent = "從右側選取引註事實";
        document.body.appendChild(tooltip);

        // Calculate the middlepoint of the selection
        const mid =
            Math.min(rangeRect.left, rangeRect.right) +
            Math.abs(rangeRect.left - rangeRect.right) / 2;
        // Ensure the tooltip is within the viewport
        const leftX = Math.max(
            0,
            Math.min(
                mid - tooltip.offsetWidth / 2,
                window.innerWidth - tooltip.offsetWidth,
            ),
        );

        tooltip.style.top = `${rangeRect.top - 30}px`;
        tooltip.style.left = `${leftX}px`;
        tooltip.classList.remove("opacity-0");
    }, [setInSelectionMode, getSelectedReferenceMarker]);

    // Add event listeners for selection change and window resize
    useEffect(() => {
        document.addEventListener("selectionchange", handleSelection);
        // Since resizing the window can change the position of the tooltip, we need to reposition it
        window.addEventListener("resize", handleSelection);
        return () => {
            document.removeEventListener("selectionchange", handleSelection);
            window.removeEventListener("resize", handleSelection);
        };
    }, [handleSelection]);

    // Add a fact to the current reference marker
    const addFactToReferenceMarker = (factIndex: number) => {
        const newMap = new Map(selectedFacts);

        // Has marker id
        if (curReferenceMarkerId !== null) {
            // Add the fact to the selectedFacts map
            const existingFacts = newMap.get(curReferenceMarkerId) ?? [];
            if (!existingFacts.includes(factIndex)) {
                newMap.set(curReferenceMarkerId, [...existingFacts, factIndex]);
            }

            // Update the selected reference counter
            updateReferenceCounter({
                referenceMarkerId: String(curReferenceMarkerId),
                referencedIndexes: newMap.get(curReferenceMarkerId) ?? [],
            });
        }

        // No marker id, new id = avaliableMarkerId
        else {
            // Add the fact to the selectedFacts map
            const existingFacts = newMap.get(avaliableMarkerId) ?? [];
            if (!existingFacts.includes(factIndex)) {
                newMap.set(avaliableMarkerId, [...existingFacts, factIndex]);
            }

            // Update the selected area with the new reference marker
            const selection = window.getSelection();
            if (!selection) return;
            const range = selection.getRangeAt(0);
            encapsuleReferenceMarker({
                range,
                referenceMarkerId: String(avaliableMarkerId),
                referencedIndexes: newMap.get(avaliableMarkerId) ?? [],
            });
            setAvaliableMarkerId((prev) => prev + 1);
        }

        // Update the selected facts state
        setSelectedFacts(newMap);
    };

    // Remove a fact from the current reference marker
    const removeFactFromReferenceMarker = (factIndex: number) => {
        // If curReferenceMarkerId is null, return. There is no reference marker to remove the fact from
        if (curReferenceMarkerId === null) {
            console.error("No reference marker to remove the fact from");
            return;
        }

        // Remove the fact from the selectedFacts map
        const newMap = new Map(selectedFacts);
        if (curReferenceMarkerId !== null)
            newMap.set(curReferenceMarkerId, [
                ...(newMap
                    .get(curReferenceMarkerId)
                    ?.filter((id) => id !== factIndex) ?? []),
            ]);

        // Update the selected reference counter
        updateReferenceCounter({
            referenceMarkerId: String(curReferenceMarkerId),
            referencedIndexes: newMap.get(curReferenceMarkerId) ?? [],
        });

        // Update the selected facts state
        setSelectedFacts(newMap);
    };

    // Remove the fact from the imported FactList
    // and update all the reference markers
    const removeFactFromAllReferenceMarker = (factIndex: number) => {
        // Remove the fact from the selectedFacts map
        const newMap = new Map<number, number[]>(selectedFacts);
        for (const [key, value] of newMap.entries()) {
            if (value.length === 0) continue;
            newMap.set(
                key,
                value
                    .filter((idx) => idx !== factIndex)
                    .map((idx) => (idx > factIndex ? idx - 1 : idx)),
            );
        }

        // Get current displayed reference markers id
        const displayedReferenceMarkersId = Array.from(
            document.querySelectorAll(".reference-marker.start"),
        ).map((marker) => Number(marker.getAttribute("data-marker-id")));

        // Update the existing reference counters
        displayedReferenceMarkersId.forEach((id) => {
            updateReferenceCounter({
                referenceMarkerId: String(id),
                referencedIndexes: newMap.get(id) ?? [],
            });
        });

        // Update the selected facts state
        setSelectedFacts(newMap);
    };

    // Get the selected facts for current selected reference marker as array
    const getCurSelectedFacts = () => {
        // If curReferenceMarkerId is null, use the avaliableMarkerId
        // Which means a new reference marker is being created
        return curReferenceMarkerId === null
            ? (selectedFacts.get(avaliableMarkerId) ?? [])
            : (selectedFacts.get(curReferenceMarkerId) ?? []);
    };

    return (
        <ReferenceMarkerContext.Provider
            value={{
                inSelectionMode,
                inputRef,
                addFactToReferenceMarker,
                removeFactFromReferenceMarker,
                removeFactFromAllReferenceMarker,
                getCurSelectedFacts,
            }}
        >
            {children}
        </ReferenceMarkerContext.Provider>
    );
}
