"use client";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, TextInput } from "@mantine/core";
import { useState, useEffect, useContext } from "react";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import { debounce } from "lodash";
import {
    textSuggestion,
    type textSuggestionResponse,
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

    const putSuggestions = (suggestions: textSuggestionResponse) => {
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
    };
    const getSuggestionDebounced = debounce(async () => {
        if (inputRef.current === null) return;
        const text = extractPureText(inputRef.current);
        const suggestion = await textSuggestion({ text, auth_token: "" });
        console.log("suggestion", suggestion);
        putSuggestions(suggestion);
    }, 500);

    //TODO: add mutation observer to prevent the suggestion tag from being deleted
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
