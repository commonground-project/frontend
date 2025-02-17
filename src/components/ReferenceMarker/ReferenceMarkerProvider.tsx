"use client";

import { createContext, useState, useRef, useEffect, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
    encapsuleReferenceMarker,
    decapsuleReferenceMarker,
    updateReferenceCounter,
} from "@/lib/referenceMarker/referenceMarkerEditors";

export const ReferenceMarkerContext = createContext<{
    selectedFacts: Map<number, number[]>;
    setSelectedFacts: Dispatch<SetStateAction<Map<number, number[]>>>;
    inSelectionMode: boolean;
    setInSelectionMode: Dispatch<SetStateAction<boolean>>;
    curReferenceMarkerId: number | null;
    setCurReferenceMarkerId: Dispatch<SetStateAction<number | null>>;
    avaliableMarkerId: number;
    setAvaliableMarkerId: Dispatch<SetStateAction<number>>;
    inputRef: React.RefObject<HTMLDivElement | null>;
    addFactToReferenceMarker: (factIndex: number) => void;
    removeFactFromReferenceMarker: (factIndex: number) => void;
}>({
    selectedFacts: new Map().set(0, []),
    setSelectedFacts: () => {},
    inSelectionMode: false,
    setInSelectionMode: () => {},
    curReferenceMarkerId: null,
    setCurReferenceMarkerId: () => {},
    avaliableMarkerId: 0,
    setAvaliableMarkerId: () => {},
    inputRef: { current: null },
    addFactToReferenceMarker: () => {},
    removeFactFromReferenceMarker: () => {},
});

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
                        const id = (node as HTMLElement).id;

                        if (!countMap.has(id)) countMap.set(id, []);
                        const cloneNode = node.cloneNode(true);
                        countMap.get(id)?.push(cloneNode);
                    }
                });
            });

            console.log(countMap);
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
                    selectedMarkerId = startMarkers[i].id;
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

    // Update the current selected reference marker according to the selection
    // every time the selectedFacts changes
    useEffect(() => {
        if (inputRef?.current === null) return;
        const selection = window.getSelection();
        // If there is no selection or the selection is collapsed, stop processing
        if (!selection || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);

        // Check if the selection overlaps with an existing reference marker
        // If it does, we assume the user wants to update that marker
        const selectedMarkerId = getSelectedReferenceMarker(range);

        if (selectedMarkerId) {
            // selected a existing marker, update the facts
            const facts = selectedFacts.get(Number(selectedMarkerId));
            if (!facts) {
                console.error("marker id not setup: ", selectedMarkerId);
                return;
            }
            if (facts.length === 0) {
                // if no fact is selected, remove the marker
                decapsuleReferenceMarker({
                    referenceMarkerId: selectedMarkerId,
                });
                return;
            }
            // update the reference counter
            updateReferenceCounter({
                referenceMarkerId: selectedMarkerId,
                referencedIndexes: facts,
            });
        } else {
            // selected a new range, create a new marker
            if (curReferenceMarkerId === null) {
                const facts = selectedFacts.get(avaliableMarkerId);
                if (!facts) {
                    console.error("marker id not setup: ", avaliableMarkerId);
                    return;
                }
                if (facts.length === 0) return;
                encapsuleReferenceMarker({
                    range,
                    referenceMarkerId: String(avaliableMarkerId),
                    referencedIndexes: facts,
                });
                setAvaliableMarkerId((prev) => prev + 1);
            }
        }

        // Preserve the selection
        selection.removeAllRanges();
        selection.addRange(range);
    }, [selectedFacts]);

    // Add a fact to the current reference marker
    const addFactToReferenceMarker = (factIndex: number) => {
        setSelectedFacts((prev) => {
            const newMap = new Map(prev);
            if (curReferenceMarkerId !== null) {
                console.log("has marker id");
                return newMap.set(curReferenceMarkerId, [
                    ...(newMap.get(curReferenceMarkerId) ?? []),
                    factIndex,
                ]);
            } else {
                newMap.set(avaliableMarkerId, [
                    ...(newMap.get(avaliableMarkerId) ?? []),
                    factIndex,
                ]);
                console.log("no marker id, new id = ", avaliableMarkerId);
            }
            return newMap;
        });
    };

    // Remove a fact from the current reference marker
    const removeFactFromReferenceMarker = (factIndex: number) => {
        setSelectedFacts((prev) => {
            const newMap = new Map(prev);
            if (curReferenceMarkerId !== null)
                newMap.set(curReferenceMarkerId, [
                    ...(newMap
                        .get(curReferenceMarkerId)
                        ?.filter((id) => id !== factIndex) ?? []),
                ]);
            return newMap;
        });
    };

    return (
        <ReferenceMarkerContext.Provider
            value={{
                selectedFacts,
                setSelectedFacts,
                inSelectionMode,
                setInSelectionMode,
                curReferenceMarkerId,
                setCurReferenceMarkerId,
                avaliableMarkerId,
                setAvaliableMarkerId,
                inputRef,
                addFactToReferenceMarker,
                removeFactFromReferenceMarker,
            }}
        >
            {children}
        </ReferenceMarkerContext.Provider>
    );
}
