"use client";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, TextInput } from "@mantine/core";
import {
    useState,
    useRef,
    useEffect,
    useCallback,
    Dispatch,
    SetStateAction,
} from "react";
import { Toaster, toast } from "sonner";
import Link from "next/link";

type ViewpointCardProps = {
    issueId: string;
    viewpointTitle: string;
    setViewpointTitle: (value: string) => void;
    publishViewpoint: (content: string[]) => void;
    pendingPublish: boolean;
    setInSelectionMode: (value: boolean) => void;
    selectedFacts: Map<number, number[]>;
    curReferenceMarkerId: number | null;
    setCurReferenceMarkerId: (value: number | null) => void;
    avaliableMarkerId: number;
    setAvaliableMarkerId: Dispatch<SetStateAction<number>>;
};

export default function ViewpointCard({
    issueId,
    viewpointTitle,
    setViewpointTitle,
    publishViewpoint,
    pendingPublish,
    setInSelectionMode,
    selectedFacts,
    curReferenceMarkerId,
    setCurReferenceMarkerId,
    avaliableMarkerId,
    setAvaliableMarkerId,
}: ViewpointCardProps) {
    const [contentEmpty, setContentEmpty] = useState<boolean>(true);
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        //manage the placeholder in the content area
        if (inputRef?.current === null || inputRef.current.innerHTML !== "")
            return;
        const placeholderElement = document.createElement("p");
        placeholderElement.className = "text-neutral-500";
        placeholderElement.textContent =
            "開始打字，或選取一段文字來新增引注資料";
        inputRef.current.appendChild(placeholderElement);
    }, [inputRef]);

    const onPublish = () => {
        if (viewpointTitle == "" || contentEmpty) {
            toast.error("標題和內容不得為空");
            return;
        }

        const paragraphs = Array.from(inputRef.current?.childNodes ?? []).map(
            (node) => node.textContent,
        );
        const content = paragraphs.filter(
            (p) => p !== null && p !== "",
        ) as string[];

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
        const existingMarkers =
            document.getElementsByClassName("reference-marker");

        let selectedMarker: Element | null = null;
        if (existingMarkers.length > 0) {
            for (const marker of existingMarkers) {
                if (rangeOverlaps(range, marker)) {
                    selectedMarker = marker;
                    break;
                }
            }
        }
        setCurReferenceMarkerId(
            selectedMarker?.id ? parseInt(selectedMarker.id) : null,
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

    const rangeOverlaps = (range: Range, node: Node) => {
        const nodeRange = document.createRange();
        nodeRange.selectNode(node);
        return (
            range.compareBoundaryPoints(Range.END_TO_START, nodeRange) < 0 &&
            range.compareBoundaryPoints(Range.START_TO_END, nodeRange) > 0
        );
    };

    const decapsuleReferenceMarker = (referenceId: string) => {
        //find every reference marker and reference counter with the same id
        const referenceMarkers = document.querySelectorAll(
            `#\\3${referenceId}.reference-marker`,
        );
        const referenceCounters = document.querySelectorAll(
            `#\\3${referenceId}.reference-counter`,
        );
        referenceMarkers.forEach((marker) => marker.remove());
        referenceCounters.forEach((counter) => counter.remove());
    };

    const encapsuleReferenceMarker = (
        range: Range,
        facts: number[],
        id: number,
    ) => {
        // Create the element to insert at the start of the range
        const startElement = document.createElement("span");
        startElement.id = String(id);
        startElement.className = "reference-marker start";
        startElement.textContent = "[Start]";
        startElement.style.color = "blue";

        // Create the element to insert at the end of the range
        const endElement = document.createElement("span");
        endElement.id = String(id);
        endElement.className = "reference-marker end";
        endElement.textContent = "[End]";
        endElement.style.color = "green";

        // Insert the start element
        range.insertNode(startElement);

        // Adjust the range to account for the new element at the start
        range.setStartAfter(startElement);

        // Insert the end element (must be after adjusting the range)
        range.collapse(false); // Collapse to the end of the range
        range.insertNode(endElement);

        updateReferenceCounter(String(id), facts);
    };

    const updateReferenceCounter = (referenceId: string, facts: number[]) => {
        console.log("updateReferenceCounter", referenceId);
        const referenceCounter = document.querySelector(
            `#\\3${referenceId}.reference-counter`,
        );
        if (referenceCounter) {
            (referenceCounter as HTMLElement).innerText =
                " " + facts.map((fact) => `[${fact + 1}]`).join("");
            return;
        }
        // Reference marker not found, create a new one
        // Find the end reference marker in the document
        const referenceMarkerEnd = document.querySelector(
            `#\\3${referenceId}.reference-marker.end`,
        );
        if (!referenceMarkerEnd) {
            console.error("end reference marker not found");
            return;
        }
        const newReferenceCounter = document.createElement("span");
        newReferenceCounter.classList.add("reference-counter");
        newReferenceCounter.id = referenceId;
        newReferenceCounter.innerText =
            " " + facts.map((fact) => `[${fact + 1}]`).join("");

        referenceMarkerEnd.parentNode?.insertBefore(
            newReferenceCounter,
            referenceMarkerEnd,
        );
    };

    useEffect(() => {
        if (inputRef?.current === null) return;
        const selection = window.getSelection();
        // If there is no selection or the selection is collapsed, stop processing
        if (!selection || selection.isCollapsed) return;

        const range = selection.getRangeAt(0);

        // Check if the selection overlaps with an existing reference marker
        // If it does, we assume the user wants to update that marker
        const existingMarkers =
            document.getElementsByClassName("reference-marker");

        let selectedMarker: Element | null = null;
        if (existingMarkers.length > 0) {
            for (const marker of existingMarkers) {
                if (rangeOverlaps(range, marker)) {
                    selectedMarker = marker;
                    break;
                }
            }
        }

        if (selectedMarker) {
            // selected a existing marker, update the facts
            const facts = selectedFacts.get(Number(selectedMarker.id));
            if (!facts) {
                console.error("marker id not setup: ", selectedMarker.id);
                return;
            }
            if (facts.length === 0) {
                // if no fact is selected, remove the marker
                decapsuleReferenceMarker(selectedMarker.id);
                return;
            }
            // update the reference counter
            updateReferenceCounter(selectedMarker.id, facts);
        } else {
            // selected a new range, create a new marker
            if (curReferenceMarkerId === null) {
                const facts = selectedFacts.get(avaliableMarkerId);
                if (!facts) {
                    console.error("marker id not setup: ", avaliableMarkerId);
                    return;
                }
                if (facts.length === 0) return;
                encapsuleReferenceMarker(range, facts, avaliableMarkerId);
                setAvaliableMarkerId((prev) => prev + 1);
            }
        }

        // Preserve the selection
        selection.removeAllRanges();
        selection.addRange(range);
    }, [selectedFacts]);

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
                        placeholderElement.className = "text-neutral-500";
                        placeholderElement.textContent =
                            "開始打字，或選取一段文字來新增引注資料";
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
