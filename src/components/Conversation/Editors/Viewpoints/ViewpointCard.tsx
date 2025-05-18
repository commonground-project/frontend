"use client";
import { v4 as uuidv4 } from "uuid";
import {
    TrashIcon,
    PlusIcon,
    XMarkIcon,
    LinkIcon,
} from "@heroicons/react/24/outline";
import { Button, TextInput, Modal, ActionIcon } from "@mantine/core";
import { useRouter } from "next/navigation";
import {
    useEffect,
    useContext,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type { RefObject } from "react";
import debounce from "lodash/debounce";
import { toast } from "sonner";

import { ReferenceMarkerContext } from "@/lib/referenceMarker/referenceMarkerContext";
import withErrorBoundary from "@/lib/utils/withErrorBoundary";
import CitationDrawer from "@/components/Conversation/Facts/CitationDrawer/CitationDrawer";
import type { Fact } from "@/types/conversations.types";

type ViewpointCardProps = {
    issueId: string;
    viewpointTitle: string;
    setViewpointTitle: (value: string) => void;
    viewpointTitleRef: RefObject<HTMLInputElement | null>;
    phrasedContent: RefObject<string>;
    viewpointFactList: Fact[];
    setViewpointFactList: Dispatch<SetStateAction<Fact[]>>;
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

function ViewpointCard({
    issueId,
    viewpointTitle,
    setViewpointTitle,
    viewpointTitleRef,
    phrasedContent,
    viewpointFactList,
    setViewpointFactList,
    saveContextToLocal,
    deleteContextFromLocal,
    publishViewpoint,
    initialContentEmpty,
    pendingPublish,
}: ViewpointCardProps) {
    const { inputRef, getInputFieldContent, inSelectionMode } = useContext(
        ReferenceMarkerContext,
    );
    const router = useRouter();

    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] =
        useState<boolean>(false); // is the confirm delete popover open

    const [isContentEmpty, setIsContentEmpty] =
        useState<boolean>(initialContentEmpty); // is the content empty
    const [isContentTooShort, setIsContentTooShort] = useState<boolean>(true); // is the content length <= 200
    const [drawerId, setDrawerId] = useState<string | null>(null); // for the citation drawer
    const [contentLengthWarning, setContentLengthWarning] =
        useState<boolean>(false); // Content length warning modal open

    useMemo(() => {
        setIsContentEmpty(initialContentEmpty);
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

    // reposition the toolbar when the keyboard is open
    useEffect(() => {
        const repositionToolbar = () => {
            const toolbar = document.getElementById("citation-toolbar");

            if (!toolbar || !window.visualViewport) return;
            const viewportHeight = window.visualViewport.height;
            const layoutViewportHeight = window.innerHeight;

            // if the viewport height is equal to the layout viewport height, it means the keyboard is not open, consider the footer height
            if (viewportHeight === layoutViewportHeight)
                toolbar.style.bottom = "88px";
            // if the viewport height is less than the layout viewport height, it means the keyboard is open, consider only the gap between the keyboard and the toolbar
            else
                toolbar.style.bottom = `${layoutViewportHeight - viewportHeight + 12}px`;
        };

        // initial reposition
        repositionToolbar();

        window.visualViewport?.addEventListener("resize", repositionToolbar);
        window.visualViewport?.addEventListener("scroll", repositionToolbar);

        return () => {
            window.visualViewport?.removeEventListener(
                "resize",
                repositionToolbar,
            );
            window.visualViewport?.removeEventListener(
                "scroll",
                repositionToolbar,
            );
        };
    });

    // adust the input field height when the keyboard is open to keep the content visible.
    useEffect(() => {
        const adjustInputFieldHeight = () => {
            const inputFieledContainer = document.getElementById(
                "input-field-container",
            );

            if (!inputFieledContainer || !window.visualViewport) return;

            const viewportHeight = window.visualViewport.height;
            const layoutViewportHeight = window.innerHeight;

            if (viewportHeight === layoutViewportHeight) {
                // h = 100hv-32px(publish button)-36px(Title input)-16px(gap from container)-16px(padding from container)-56px(header)
                inputFieledContainer.style.height = `${layoutViewportHeight - 32 - 36 - 16 - 16 - 56}px`;
            } else {
                inputFieledContainer.style.height = `${viewportHeight - 32 - 36 - 16}px`;
            }
        };

        // initial adjust
        adjustInputFieldHeight();
        window.visualViewport?.addEventListener(
            "resize",
            adjustInputFieldHeight,
        );

        return () => {
            window.visualViewport?.removeEventListener(
                "resize",
                adjustInputFieldHeight,
            );
        };
    }, []);

    const onPublish = (bypass = false) => {
        if (viewpointTitle == "" || isContentEmpty) {
            toast.error("標題和內容不得為空");

            return;
        }

        if (inputRef.current === null) return;
        phrasedContent.current = getInputFieldContent();
        if (!bypass) {
            if (phrasedContent.current.length < 200) {
                setContentLengthWarning(true);
                return;
            }
        }

        publishViewpoint();
    };

    return (
        <div className="flex h-full flex-col">
            <Modal
                opened={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                title="確認刪除觀點"
            >
                <div className="text-neutral-800">{`你確定要刪除觀點《${viewpointTitle}》嗎？此動作無法復原。`}</div>
                <div className="flex justify-end gap-4 pt-3">
                    <Button
                        variant="outline"
                        color="gray"
                        onClick={() => {
                            setIsConfirmDeleteOpen(false);
                        }}
                    >
                        <XMarkIcon className="mr-2 size-5" />
                        取消
                    </Button>
                    <Button
                        variant="filled"
                        color="red"
                        onClick={() => {
                            deleteContextFromLocal();
                            router.push(`/issues/${issueId}`);
                        }}
                    >
                        <TrashIcon className="mr-2 size-5" />
                        刪除
                    </Button>
                </div>
            </Modal>
            <Modal
                opened={contentLengthWarning}
                onClose={() => setContentLengthWarning(false)}
                title="內容長度不足"
            >
                CommonGround 建議您將觀點延長至 200 字以上來更清楚的表達您的想法
                <div className="mt-2 flex justify-end gap-3">
                    <Button
                        variant="light"
                        onClick={() => {
                            setContentLengthWarning(false);
                        }}
                    >
                        延長
                    </Button>
                    <Button
                        variant="light"
                        color="yellow"
                        onClick={() => {
                            setContentLengthWarning(false);
                            onPublish(true);
                        }}
                    >
                        仍要發表
                    </Button>
                </div>
            </Modal>
            <div className="flex justify-between md:hidden">
                <ActionIcon
                    variant="transparent"
                    className="text-neutral-500 duration-300 hover:text-emerald-500"
                    onClick={() => setIsConfirmDeleteOpen(true)}
                >
                    <XMarkIcon className="inline-block h-6 w-6 text-neutral-500" />
                </ActionIcon>
                <Button
                    variant="filled"
                    leftSection={<PlusIcon className="h-5 w-5" />}
                    disabled={viewpointTitle == "" || isContentEmpty}
                    classNames={{
                        root: `px-0 h-8 w-[76px] text-sm font-normal text-white ${isContentTooShort ? "opacity-50" : ""}`,
                        section: "mr-1",
                    }}
                    onClick={() => onPublish()}
                    loading={pendingPublish}
                >
                    發表
                </Button>
            </div>
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
                    input: "font-serif border-none bg-transparent text-2xl font-semibold text-neutral-700 placeholder:text-neutral-500 focus:outline-none",
                }}
            />
            <div
                id="input-field-container"
                className="overflow-y-auto pt-3 md:pt-5"
            >
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

                        if (inputRef?.current === null) return;
                        const length = getInputFieldContent().length;
                        setIsContentEmpty(length === 0);
                        setIsContentTooShort(length < 200);
                    }}
                    onFocus={() => {
                        if (!inputRef?.current || !isContentEmpty) return;
                        inputRef.current.innerHTML = "";
                    }}
                    onBlur={() => {
                        if (inputRef?.current === null) return;
                        const isEmpty = getInputFieldContent().length === 0;
                        setIsContentEmpty(isEmpty);
                        if (isEmpty) {
                            inputRef.current.innerHTML = "";
                            const placeholderElement =
                                document.createElement("p");
                            placeholderElement.id = "placeholder";
                            placeholderElement.className = "text-neutral-500";
                            placeholderElement.textContent =
                                "開始打字，或選取一段文字來新增引註資料";
                            inputRef.current.appendChild(placeholderElement);
                            return;
                        }
                    }}
                />
            </div>
            {/* citation tool bar */}
            {inSelectionMode && (
                <button
                    id="citation-toolbar"
                    className="fixed left-[calc(50%-61px)] flex h-9 w-[122px] items-center justify-center gap-1 rounded-md border border-emerald-600 bg-white shadow-xl md:hidden"
                    onClick={() => setDrawerId(uuidv4())}
                >
                    <LinkIcon className="size-5 text-emerald-600" />
                    <div className="text-sm font-medium text-emerald-600">
                        引註資料
                    </div>
                </button>
            )}
            <CitationDrawer
                issueId={issueId}
                drawerId={drawerId}
                setDrawerId={setDrawerId}
                viewpointFactList={viewpointFactList}
                setViewpointFactList={setViewpointFactList}
                addFact={(newFact) => {
                    setViewpointFactList((prev) => [...prev, newFact]);
                    autoSave(
                        viewpointTitleRef.current?.value ?? viewpointTitle,
                        viewpointFactList.map((fact) => fact.id),
                    );
                }}
            />

            <div className="hidden md:flex md:justify-end md:gap-3">
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
                <Button
                    variant="filled"
                    leftSection={<PlusIcon className="h-5 w-5" />}
                    disabled={viewpointTitle == "" || isContentEmpty}
                    classNames={{
                        root: `px-0 h-8 w-[76px] text-sm font-normal text-white ${isContentTooShort ? "opacity-50" : ""}`,
                        section: "mr-1",
                    }}
                    onClick={() => onPublish()}
                    loading={pendingPublish}
                >
                    發表
                </Button>
            </div>
        </div>
    );
}

export default withErrorBoundary(ViewpointCard);
