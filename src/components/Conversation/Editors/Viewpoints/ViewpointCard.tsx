"use client";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, TextInput } from "@mantine/core";
import { useState, useEffect, useContext, useRef } from "react";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import { debounce } from "lodash";
import {
    textSuggestion,
    type TextSuggestion,
    type TextSuggestionResponse,
} from "@/lib/requests/suggestions/textSuggestion";
import {
    phraseReferencedContent,
    extractPureText,
} from "@/lib/referenceMarker/phraseReferencedContent";
import { ReferenceMarkerContext } from "@/lib/referenceMarker/referenceMarkerContext";
import {
    encapsuleSuggestionMarker,
    setRangeByTextOffset,
    removeAllSuggestionMarkers,
} from "@/lib/textSuggestion/textSuggestionEditor";
import SuggestionPopover from "@/components/Conversation/Editors/TextSuggestion/SuggestionPopover";

type ViewpointCardProps = {
    issueId: string;
    viewpointTitle: string;
    setViewpointTitle: (value: string) => void;
    publishViewpoint: (content: string) => void;
    pendingPublish: boolean;
};

export default function ViewpointCard({
    issueId,
    viewpointTitle,
    setViewpointTitle,
    publishViewpoint,
    pendingPublish,
}: ViewpointCardProps) {
    const { inputRef } = useContext(ReferenceMarkerContext);

    const [contentEmpty, setContentEmpty] = useState<boolean>(true);
    const [isSuggestionOpen, setIsSuggestionOpen] = useState<boolean>(false);
    const [suggestionTarget, setSuggestionTarget] =
        useState<HTMLElement | null>(null);
    const curSuggestionMessage = useRef<TextSuggestion | null>(null);
    const suggestionMessages = useRef<TextSuggestion[]>([]);

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

    const putSuggestions = (suggestions: TextSuggestionResponse) => {
        if (inputRef.current === null) return;

        // remove all previous suggestion markers
        removeAllSuggestionMarkers();

        // Add suggestion markers to the text
        const pureTextContent = extractPureText(inputRef.current);
        suggestions.suggestions.forEach((sug, index) => {
            // find the tag in the suggestion
            const regex = /<sug(\d+)>(.*?)<\/sug\1>/g;
            const match = regex.exec(sug.message);
            if (match === null) return;

            // match the suggestion text to the view point content to find the position
            const suggestionStart = pureTextContent.indexOf(match[2]);
            const suggestionEnd = suggestionStart + match[2].length;

            // create a range to highlight the suggestion
            const range = setRangeByTextOffset(
                inputRef.current as Node,
                suggestionStart,
                suggestionEnd,
            );
            if (range === null) return;

            // highlight the suggestion
            encapsuleSuggestionMarker({
                range,
                suggestionId: index.toString(),
            });
        });

        // set the suggestion messages
        suggestionMessages.current = suggestions.suggestions;
    };

    const getSuggestionDebounced = debounce(async () => {
        if (inputRef.current === null) return;

        const text = extractPureText(inputRef.current);
        const suggestion = await textSuggestion({ text, auth_token: "" });
        console.log("suggestion", suggestion);
        putSuggestions(suggestion);
    }, 500);

    // add mutation observer to prevent the suggestion tag from being deleted n
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
                        (node as HTMLElement).classList.contains(
                            "suggestion-marker",
                        )
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
                if (nodes.length === 2) return;
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

    // add click event listener to open the suggestion dropdown
    useEffect(() => {
        if (inputRef?.current === null) return;
        const handleClick = (e: MouseEvent) => {
            if (
                (e.target as HTMLElement).classList.contains(
                    "sug-highlight-wrapper",
                )
            ) {
                setSuggestionTarget(e.target as HTMLElement);
                setIsSuggestionOpen(true);
                curSuggestionMessage.current =
                    suggestionMessages.current[
                        Number((e.target as HTMLElement).dataset.markerId) ?? 0
                    ];
            } else {
                setIsSuggestionOpen(false);
                setSuggestionTarget(null);
                curSuggestionMessage.current = null;
            }
        };
        inputRef.current.addEventListener("click", handleClick);
        return () =>
            inputRef.current?.removeEventListener("click", handleClick);
    }, [inputRef]);

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
                    getSuggestionDebounced();
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
            {suggestionTarget && curSuggestionMessage.current && (
                <SuggestionPopover
                    target={suggestionTarget}
                    show={isSuggestionOpen}
                    suggestionMessage={curSuggestionMessage.current}
                />
            )}
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
