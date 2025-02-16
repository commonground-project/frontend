"use client";

import { createContext, useState, useRef, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

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

    useEffect(() => {
        if (inputRef?.current === null) return;
        observer.observe(inputRef.current, {
            childList: true,
            subtree: true,
        });
        return () => observer.disconnect();
    }, [inputRef, observer]);

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
            }}
        >
            {children}
        </ReferenceMarkerContext.Provider>
    );
}
