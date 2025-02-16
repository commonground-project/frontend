"use client";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, TextInput } from "@mantine/core";
import {
    useState,
    useRef,
    useEffect,
    useCallback,
    useContext,
    type Dispatch,
    type SetStateAction,
} from "react";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import {
    encapsuleReferenceMarker,
    decapsuleReferenceMarker,
    updateReferenceCounter,
} from "@/lib/referenceMarker/referenceMarkerEditors";
import { phraseReferencedContent } from "@/lib/referenceMarker/phraseReferencedContent";
import { ReferenceMarkerContext } from "@/components/ReferenceMarker/ReferenceMarkerProvider";

type ViewpointCardProps = {
    issueId: string;
    viewpointTitle: string;
    setViewpointTitle: (value: string) => void;
    publishViewpoint: (content: string) => void;
    pendingPublish: boolean;
    // setInSelectionMode: (value: boolean) => void;
    // curReferenceMarkerId: number | null;
    // setCurReferenceMarkerId: (value: number | null) => void;
    // avaliableMarkerId: number;
    // setAvaliableMarkerId: Dispatch<SetStateAction<number>>;
};

export default function ViewpointCard({
    issueId,
    viewpointTitle,
    setViewpointTitle,
    publishViewpoint,
    pendingPublish,
    // setInSelectionMode,
    // curReferenceMarkerId,
    // setCurReferenceMarkerId,
    // avaliableMarkerId,
    // setAvaliableMarkerId,
}: ViewpointCardProps) {
    const {
        selectedFacts,
        setInSelectionMode,
        curReferenceMarkerId,
        setCurReferenceMarkerId,
        avaliableMarkerId,
        setAvaliableMarkerId,
    } = useContext(ReferenceMarkerContext);

    const [contentEmpty, setContentEmpty] = useState<boolean>(true);
    const inputRef = useRef<HTMLDivElement>(null);

    //manage the placeholder in the content area
    useEffect(() => {
        if (inputRef?.current === null || inputRef.current.innerHTML !== "")
            return;
        const placeholderElement = document.createElement("p");
        placeholderElement.className = "text-neutral-500";
        placeholderElement.textContent =
            "開始打字，或選取一段文字來新增引註資料";
        inputRef.current.appendChild(placeholderElement);
    }, [inputRef]);

    const onPublish = () => {
        if (viewpointTitle == "" || contentEmpty) {
            toast.error("標題和內容不得為空");
            return;
        }

        if (inputRef.current === null) return;
        const content = phraseReferencedContent(inputRef.current);

        publishViewpoint(content);
    };

    const handleSelection = useCallback(() => {
        // Reset selection mode and tooltip no matter what
        // Since they will eventually be added back if a selection is made, it is safe to remove them here first
        // And since React will batch the state updates, calling setInSelectionMode(false) here will not cause the tooltip to flash
        setInSelectionMode(false);
        document.getElementById("fact-hint-tooltip")?.remove();

        // If the current active element is not the content editable div, stop the tooltip from showing
        if (document.activeElement?.id !== "viewpoint-input") return;

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
    }, [setInSelectionMode]);

    useEffect(() => {
        document.addEventListener("selectionchange", handleSelection);
        // Since resizing the window can change the position of the tooltip, we need to reposition it
        window.addEventListener("resize", handleSelection);
        return () => {
            document.removeEventListener("selectionchange", handleSelection);
            window.removeEventListener("resize", handleSelection);
        };
    }, [handleSelection]);

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

    const getSelectedReferenceMarker = (range: Range) => {
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
    };

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

    // Observe the input area
    useEffect(() => {
        if (inputRef?.current === null) return;
        observer.observe(inputRef.current, {
            childList: true,
            subtree: true,
        });
        return () => observer.disconnect();
    }, [inputRef, observer]);

    return (
        <div className="flex h-full flex-col gap-2 overflow-auto rounded-lg bg-neutral-100 px-7 py-4">
            <Toaster />
            <h1 className="text-lg font-semibold text-neutral-700">觀點</h1>
            <TextInput
                value={viewpointTitle}
                onChange={(e) => setViewpointTitle(e.currentTarget.value)}
                variant="unstyled"
                radius={0}
                placeholder="用一句話簡述你的觀點"
                className="w-full"
                classNames={{
                    input: "border-none bg-transparent text-2xl font-semibold text-neutral-700 placeholder:text-neutral-500 focus:outline-none",
                }}
            />
            <div
                id="viewpoint-input"
                contentEditable
                className="h-full min-h-7 w-full resize-none bg-transparent text-lg font-normal text-neutral-700 placeholder:text-neutral-500 focus:outline-none"
                ref={inputRef}
                onInput={(e) => {
                    Array.from(e.currentTarget.children).forEach((node) => {
                        if (node.className.includes("pt-1.5")) return;
                        node.classList.add("pt-1.5");
                    });
                }}
                onFocus={() => {
                    if (!contentEmpty || !inputRef?.current) return;
                    inputRef.current.innerHTML = "";
                }}
                onBlur={() => {
                    if (inputRef?.current === null) return;
                    const isEmpty = Array.from(
                        inputRef.current.childNodes,
                    ).every(
                        (node) =>
                            (node.nodeType === Node.ELEMENT_NODE &&
                                (node as HTMLElement).tagName === "BR") ||
                            (node.nodeType === Node.TEXT_NODE &&
                                node.textContent?.trim() === ""),
                    );
                    setContentEmpty(isEmpty);
                    if (isEmpty) {
                        inputRef.current.innerHTML = "";
                        const placeholderElement = document.createElement("p");
                        placeholderElement.id = "placeholder";
                        placeholderElement.className = "text-neutral-500";
                        placeholderElement.textContent =
                            "開始打字，或選取一段文字來新增引註資料";
                        inputRef.current.appendChild(placeholderElement);
                        return;
                    }
                }}
            />
            <div className="flex justify-end gap-3">
                <Button
                    component={Link}
                    href={`/issues/${issueId}`}
                    variant="outline"
                    color="#525252"
                    leftSection={<TrashIcon className="h-5 w-5" />}
                    classNames={{
                        root: "px-0 h-8 w-[76px] text-sm font-normal text-neutral-600",
                        section: "mr-1",
                    }}
                >
                    刪除
                </Button>
                <Button
                    variant="filled"
                    color="#2563eb"
                    leftSection={<PlusIcon className="h-5 w-5" />}
                    disabled={viewpointTitle == "" || contentEmpty}
                    classNames={{
                        root: "px-0 h-8 w-[76px] text-sm font-normal text-white disabled:bg-blue-300",
                        section: "mr-1",
                    }}
                    onClick={onPublish}
                    loading={pendingPublish}
                >
                    發表
                </Button>
            </div>
        </div>
    );
}
