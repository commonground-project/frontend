"use client";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, TextInput, Popover } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useContext, useRef, useMemo, useState } from "react";
import type { RefObject } from "react";
import debounce from "lodash/debounce";
import { toast } from "sonner";
import { ReferenceMarkerContext } from "@/lib/referenceMarker/referenceMarkerContext";
import type { Fact } from "@/types/conversations.types";

type ViewpointCardProps = {
    issueId: string;
    viewpointTitle: string;
    setViewpointTitle: (value: string) => void;
    viewpointTitleRef: RefObject<HTMLInputElement | null>;
    phrasedContent: RefObject<string>;
    viewpointFactList: Fact[];
    saveContextToLocal: (
        title: string,
        content: string,
        facts: string[],
    ) => void;
    deleteContextFromLocal: () => void;
    publishViewpoint: () => void;
    initialContentEmpty: boolean;
    pendingPublish: boolean;
};

export default function ViewpointCard({
    issueId,
    viewpointTitle,
    setViewpointTitle,
    viewpointTitleRef,
    phrasedContent,
    viewpointFactList,
    saveContextToLocal,
    deleteContextFromLocal,
    publishViewpoint,
    initialContentEmpty,
    pendingPublish,
}: ViewpointCardProps) {
    const { inputRef, getInputFieldContent } = useContext(
        ReferenceMarkerContext,
    );
    const router = useRouter();

    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] =
        useState<boolean>(false); // is the confirm delete popover open

    const contentEmpty = useRef<boolean>(initialContentEmpty);
    const setContentEmpty = (value: boolean) => {
        contentEmpty.current = value;
    };

    useMemo(() => {
        setContentEmpty(initialContentEmpty);
    }, [initialContentEmpty]);

    // auto-save the viewpoint content
    const autoSave = useMemo(
        () =>
            debounce((title: string, facts: string[]) => {
                const content = getInputFieldContent();
                phrasedContent.current = content;

                saveContextToLocal(title, content, facts);
            }, 2000),
        [getInputFieldContent, phrasedContent, saveContextToLocal],
    );

    // add event handlers for ctrl+s and cmd+s for saving
    useEffect(() => {
        const handleSave = (e: KeyboardEvent) => {
            if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();

                const content = getInputFieldContent();
                phrasedContent.current = content;

                saveContextToLocal(
                    viewpointTitle,
                    content,
                    viewpointFactList.map((fact) => fact.id),
                );
                // console.log("saved");
                toast.success("儲存成功");
            }
        };

        window.addEventListener("keydown", handleSave);

        return () => {
            window.removeEventListener("keydown", handleSave);
        };
    }, [
        saveContextToLocal,
        viewpointTitle,
        viewpointFactList,
        getInputFieldContent,
        phrasedContent,
    ]);

    //manage the placeholder in the content area
    useEffect(() => {
        if (inputRef?.current === null || inputRef.current.innerHTML !== "")
            return;
        const placeholderElement = document.createElement("p");
        placeholderElement.id = "placeholder";
        placeholderElement.className = "text-neutral-500";
        placeholderElement.textContent =
            "開始打字，或選取一段文字來新增引註資料";
        inputRef.current.appendChild(placeholderElement);
    }, [inputRef]);

    // clean up the auto-save function when the component unmounts
    useEffect(() => {
        const autoSaveFunc = autoSave;
        return () => {
            autoSaveFunc.cancel();
        };
    }, [autoSave]);

    // mount a mutation observer to monitor the content area changes (reference marker added/removed)
    // for auto-saving
    useEffect(() => {
        if (inputRef?.current === null) return;

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

            // auto save when the content area changes (reference marker added/removed)
            mutations.forEach((mutation) => {
                if (
                    mutation.type === "childList" ||
                    mutation.type === "characterData"
                )
                    autoSave(
                        viewpointTitleRef.current?.value ?? viewpointTitle,
                        viewpointFactList.map((fact) => fact.id),
                    );
            });
        });

        observer.observe(inputRef.current, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        return () => {
            observer.disconnect();
        };
    }, [
        inputRef,
        autoSave,
        viewpointTitle,
        viewpointFactList,
        viewpointTitleRef,
    ]);

    const onPublish = () => {
        if (viewpointTitle == "" || contentEmpty.current) {
            toast.error("標題和內容不得為空");
            return;
        }

        if (inputRef.current === null) return;
        phrasedContent.current = getInputFieldContent();

        publishViewpoint();
    };

    return (
        <div className="flex h-full flex-col gap-2 overflow-auto rounded-lg bg-neutral-100 px-7 py-4">
            <h1 className="text-lg font-semibold text-neutral-700">觀點</h1>
            <TextInput
                ref={viewpointTitleRef}
                value={viewpointTitle}
                onChange={(e) => {
                    setViewpointTitle(e.currentTarget.value);
                    autoSave(
                        viewpointTitleRef.current?.value ?? viewpointTitle,
                        viewpointFactList.map((fact) => fact.id),
                    );
                }}
                variant="unstyled"
                radius={0}
                placeholder="一句話簡述你的觀點"
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
                    if (!contentEmpty.current || !inputRef?.current) return;
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
                <Popover
                    opened={isConfirmDeleteOpen}
                    onChange={setIsConfirmDeleteOpen}
                    radius={7}
                >
                    <Popover.Target>
                        <Button
                            variant="outline"
                            color="#525252"
                            leftSection={<TrashIcon className="h-5 w-5" />}
                            classNames={{
                                root: "px-0 h-8 w-[76px] text-sm font-normal text-neutral-600",
                                section: "mr-1",
                            }}
                            onClick={() => setIsConfirmDeleteOpen(true)}
                        >
                            刪除
                        </Button>
                    </Popover.Target>
                    <Popover.Dropdown>
                        <div className="text-lg font-semibold text-neutral-700">
                            確定要刪除此觀點嗎？
                        </div>
                        <div className="flex justify-evenly gap-3 pt-3">
                            <Button
                                variant="light"
                                color="red"
                                onClick={() => {
                                    deleteContextFromLocal();
                                    router.push(`/issues/${issueId}`);
                                }}
                            >
                                刪除
                            </Button>
                            <Button
                                variant="light"
                                color="green"
                                onClick={() => {
                                    setIsConfirmDeleteOpen(false);
                                }}
                            >
                                取消
                            </Button>
                        </div>
                    </Popover.Dropdown>
                </Popover>
                <Button
                    variant="filled"
                    color="#2563eb"
                    leftSection={<PlusIcon className="h-5 w-5" />}
                    disabled={viewpointTitle == "" || contentEmpty.current}
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
