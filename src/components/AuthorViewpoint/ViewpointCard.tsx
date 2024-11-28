"use client";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, TextInput } from "@mantine/core";
import { useState, useRef, useEffect } from "react";

export default function ViewpointCard() {
    const [viewpointTitle, setViewpointTitle] = useState("");
    const [contentEmpty, setContentEmpty] = useState<boolean>(true);
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inputRef?.current === null || inputRef.current.innerHTML !== "")
            return;
        const placeholderElement = document.createElement("p");
        placeholderElement.className = "text-neutral-500";
        placeholderElement.textContent =
            "開始打字，或選取一段文字來新增引注資料";
        inputRef.current.appendChild(placeholderElement);
    }, [inputRef]);

    return (
        <div className="flex h-full flex-col gap-2 overflow-auto rounded-lg bg-neutral-100 px-7 py-4">
            <h1 className="text-lg font-semibold text-neutral-700">觀點</h1>
            <TextInput
                onChange={(e) => setViewpointTitle(e.currentTarget.value)}
                variant="unstyled"
                radius={0}
                placeholder="用一句話簡述你的觀點"
                style={{ width: "100%" }}
                classNames={{
                    input: "border-none bg-transparent text-2xl font-semibold text-neutral-700 placeholder:text-neutral-500 focus:outline-none",
                }}
            />
            <div
                contentEditable="true"
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
                    }
                }}
            />
            <div className="flex justify-end gap-3">
                <Button
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
                    classNames={{
                        root: "px-0 h-8 w-[76px] text-sm font-normal text-white",
                        section: "mr-1",
                    }}
                    onClick={() => {
                        console.log(
                            "Title= ",
                            viewpointTitle,
                            "\nContent= ",
                            inputRef.current?.innerText,
                        );
                    }}
                >
                    發表
                </Button>
            </div>
        </div>
    );
}
