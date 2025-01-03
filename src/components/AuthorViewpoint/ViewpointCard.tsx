"use client";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, TextInput } from "@mantine/core";
import { useState, useRef, useEffect, useCallback } from "react";
import { Toaster, toast } from "sonner";
import Link from "next/link";

type ViewpointCardProps = {
    issueId: string;
    viewpointTitle: string;
    setViewpointTitle: (value: string) => void;
    setViewpointContent: (value: string) => void;
    publishViewpoint: () => void;
    pendingPublish: boolean;
};

export default function ViewpointCard({
    issueId,
    viewpointTitle,
    setViewpointTitle,
    setViewpointContent,
    publishViewpoint,
    pendingPublish,
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
        const content = paragraphs.join("\n");
        setViewpointContent(content);

        publishViewpoint();
    };

    const handleSelection = useCallback(() => {
        console.log(document.activeElement);
        if (document.activeElement?.id !== "viewpoint-input") return;
        document.getElementById("fact-hint-tooltip")?.remove();

        const selection = window.getSelection();
        if (!selection) return;
        const range = selection.getRangeAt(0);
        if (range.collapsed) return;

        const fragment = range.cloneContents();
        const selectedText = Array.from(fragment.childNodes)
            .map((node) => node.textContent)
            .join("\n");

        const rangeRect = range.getBoundingClientRect();
        const tooltip = document.createElement("div");
        tooltip.className =
            "absolute bg-blue-600 z-30 text-white text-xs rounded py-1 px-2 opacity-0";
        tooltip.id = "fact-hint-tooltip";
        tooltip.textContent = "從右側選取引註事實";
        document.body.appendChild(tooltip);

        const mid =
            Math.min(rangeRect.left, rangeRect.right) +
            Math.abs(rangeRect.left - rangeRect.right) / 2;
        const leftX = Math.max(
            0,
            Math.min(
                mid - tooltip.offsetWidth / 2,
                window.innerWidth - tooltip.offsetWidth,
            ),
        );
        console.log(leftX);

        tooltip.style.top = `${rangeRect.top - 30}px`;
        tooltip.style.left = `${leftX}px`;
        tooltip.classList.remove("opacity-0");
    }, []);

    useEffect(() => {
        document.addEventListener("selectionchange", handleSelection);
        window.addEventListener("resize", handleSelection);
        return () => {
            document.removeEventListener("selectionchange", handleSelection);
            window.removeEventListener("resize", handleSelection);
        };
    }, [handleSelection]);

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
                onBlur={(e) => {
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
                    setViewpointContent(
                        e.currentTarget?.textContent
                            ? Array.from(inputRef.current?.childNodes ?? [])
                                  .map((node) => node.textContent)
                                  .join("\n")
                            : "",
                    );
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
