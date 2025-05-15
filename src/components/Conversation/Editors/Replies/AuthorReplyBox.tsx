import { useState, useEffect, useContext } from "react";
import { ReferenceMarkerContext } from "@/lib/referenceMarker/referenceMarkerContext";

type AuthorReplyBoxProps = {
    postReplyFn: (content: string) => void;
};

export default function AuthorReplyBox({ postReplyFn }: AuthorReplyBoxProps) {
    const {
        inputRef,
        inSelectionMode,
        setIsEditorReady,
        getInputFieldContent,
    } = useContext(ReferenceMarkerContext);
    const [contentEmpty, setContentEmpty] = useState<boolean>(true);

    useEffect(() => {
        //manage the placeholder in the content area
        if (inputRef?.current === null || inputRef.current.innerHTML !== "")
            return;
        const placeholderElement = document.createElement("p");
        placeholderElement.className = "text-neutral-500";
        placeholderElement.textContent =
            "開始打字，或選取一段文字來新增引註資料";
        inputRef.current.appendChild(placeholderElement);
    }, [inputRef]);

    const onPublish = () => {
        if (inputRef.current === null) return;
        const content = getInputFieldContent();
        postReplyFn(content);
    };

    return (
        <div
            className="w-full bg-transparent text-neutral-900 focus:outline-none"
            contentEditable
            ref={inputRef}
            onInput={(e) => {
                Array.from(e.currentTarget.children).forEach((node) => {
                    if (node.className.includes("pt-1.5")) return;
                    node.classList.add("pt-1.5");
                });
                const isEmpty = Array.from(e.currentTarget.childNodes).every(
                    (node) =>
                        (node.nodeType === Node.ELEMENT_NODE &&
                            (node as HTMLElement).tagName === "BR") ||
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
                const isEmpty = Array.from(inputRef.current.childNodes).every(
                    (node) =>
                        (node.nodeType === Node.ELEMENT_NODE &&
                            (node as HTMLElement).tagName === "BR") ||
                        (node.nodeType === Node.TEXT_NODE &&
                            node.textContent?.trim() === ""),
                );
                setContentEmpty(isEmpty);
            }}
        />
    );
}
