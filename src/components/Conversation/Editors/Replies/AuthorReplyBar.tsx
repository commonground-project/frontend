"use client";

import {
    LinkIcon,
    PaperAirplaneIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { ActionIcon, Textarea } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

type AuthorReplyBarProps = {
    id: string;
};

export default function AddReplyBar({ id }: AuthorReplyBarProps) {
    const [inFocus, setInFocus] = useState(false);
    const [inFocusQueue, setInFocusQueue] = useState<boolean>(false);
    const [animationSeq, setAnimationSeq] = useState<number | null>(null);
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

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         setInFocus((prev) => !prev);
    //         setAnimationSeq((prev) => (prev === null ? 0 : prev + 1));
    //     }, 1000);
    //     return () => clearTimeout(timeout);
    // }, [inFocus, setAnimationSeq]);

    useEffect(() => {
        setAnimationSeq((prev) => (prev === null ? 0 : prev + 1));
    }, [inFocusQueue, setAnimationSeq]);

    useEffect(() => {
        if (animationSeq === null) return;
        const timeout = setTimeout(() => setAnimationSeq(null), 300);
        return () => clearTimeout(timeout);
    }, [animationSeq, setAnimationSeq]);

    useEffect(() => {
        setInFocus(inFocusQueue);
    }, [animationSeq, setInFocus]);

    useEffect(() => {
        if (!inFocus || !inputRef.current) return;
        inputRef.current.focus();
    }, [inFocus]);

    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3">
            <div
                onClick={() => {
                    setInFocusQueue(true);
                }}
                className="z-20 flex w-full max-w-3xl overflow-y-hidden border border-zinc-500 bg-neutral-50 transition-[border-radius,height] duration-200"
                style={{
                    height:
                        animationSeq !== null
                            ? inFocus
                                ? "86.8px"
                                : "40px"
                            : undefined,
                    borderRadius: inFocus ? "6px" : "20px",
                }}
            >
                {inFocus ? (
                    <div className="w-full px-6 py-3">
                        <div
                            className="w-full bg-transparent text-neutral-900 focus:outline-none"
                            contentEditable
                            ref={inputRef}
                            onInput={(e) => {
                                Array.from(e.currentTarget.children).forEach(
                                    (node) => {
                                        if (node.className.includes("pt-1.5"))
                                            return;
                                        node.classList.add("pt-1.5");
                                    },
                                );
                                const isEmpty = Array.from(
                                    e.currentTarget.childNodes,
                                ).every(
                                    (node) =>
                                        (node.nodeType === Node.ELEMENT_NODE &&
                                            (node as HTMLElement).tagName ===
                                                "BR") ||
                                        (node.nodeType === Node.TEXT_NODE &&
                                            node.textContent?.trim() === ""),
                                );
                                setContentEmpty(isEmpty);
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
                                            (node as HTMLElement).tagName ===
                                                "BR") ||
                                        (node.nodeType === Node.TEXT_NODE &&
                                            node.textContent?.trim() === ""),
                                );
                                setContentEmpty(isEmpty);
                                if (isEmpty) setInFocusQueue(false);
                            }}
                        />

                        <div className="flex w-full items-center justify-between">
                            <div className="mt-2 flex items-center">
                                {/* TODO: References, disabled as feature is not in this sprint */}
                                <ActionIcon
                                    variant="transparent"
                                    className="group disabled:bg-transparent"
                                    disabled
                                >
                                    <LinkIcon className="w-6 text-emerald-600 group-disabled:text-neutral-500" />
                                </ActionIcon>
                                {/* TODO: Quotes, disabled as feature is not in this sprint */}
                                <ActionIcon
                                    variant="transparent"
                                    className="group disabled:bg-transparent"
                                    disabled
                                >
                                    <PlusIcon className="w-6 text-emerald-600 group-disabled:text-neutral-500" />
                                </ActionIcon>
                            </div>
                            <ActionIcon
                                variant="transparent"
                                className="group disabled:bg-transparent"
                                disabled={contentEmpty}
                            >
                                <PaperAirplaneIcon className="w-6 text-emerald-600 group-disabled:text-neutral-500" />
                            </ActionIcon>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center px-5 py-2">
                        <PlusIcon className="inline size-6 fill-none stroke-neutral-500 stroke-[1.5] duration-300 hover:stroke-emerald-500" />
                        <h1 className="ml-1 inline text-base font-bold text-neutral-500">
                            延續這場討論
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
}
