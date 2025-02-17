"use client";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, TextInput } from "@mantine/core";
import { useState, useEffect, useContext } from "react";
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
};

export default function ViewpointCard({
    issueId,
    viewpointTitle,
    setViewpointTitle,
    publishViewpoint,
    pendingPublish,
}: ViewpointCardProps) {
    const {
        selectedFacts,
        curReferenceMarkerId,
        avaliableMarkerId,
        setAvaliableMarkerId,
        inputRef,
    } = useContext(ReferenceMarkerContext);

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
