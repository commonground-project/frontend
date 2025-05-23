"use client";

import { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { ReferenceMarkerContext } from "@/lib/referenceMarker/referenceMarkerContext";
import {
    LinkIcon,
    PaperAirplaneIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import {
    postReply,
    type PostReplyParams,
} from "@/lib/requests/replies/postReply";
import { v4 as uuid } from "uuid";
import type { Reply } from "@/types/conversations.types";
import type { PaginatedPage } from "@/types/requests.types";
import { ActionIcon, Loader } from "@mantine/core";
import withErrorBoundary from "@/lib/utils/withErrorBoundary";

import type { Fact } from "@/types/conversations.types";
import FactImportModal from "./FactImportModal";

type AuthorReplyBarProps = {
    issueId: string;
    viewpointId: string;
};

function AuthorReplyBar({ issueId, viewpointId }: AuthorReplyBarProps) {
    const {
        inputRef,
        inSelectionMode,
        setIsEditorReady,
        getInputFieldContent,
    } = useContext(ReferenceMarkerContext);

    const [inFocus, setInFocus] = useState(false);
    const [inFocusQueue, setInFocusQueue] = useState<boolean>(false);
    const [modalId, setModalId] = useState<string | null>(null);
    const [animationSeq, setAnimationSeq] = useState<number | null>(null);
    const [contentEmpty, setContentEmpty] = useState<boolean>(true);
    const [replyFactList, setReplyFactList] = useState<Fact[]>([]);

    const [cookie] = useCookies(["auth_token"]);

    const queryClient = useQueryClient();

    const postReplyMutation = useMutation({
        mutationKey: ["postReply", viewpointId],
        mutationFn: (payload: PostReplyParams) =>
            postReply(payload, viewpointId, cookie.auth_token),
        onSuccess(data) {
            queryClient.setQueryData(
                ["replies", viewpointId],
                (oldData?: {
                    pages: PaginatedPage<Reply>[];
                    pageParams: number[];
                }): {
                    pages: PaginatedPage<Reply>[];
                    pageParams: number[];
                } => {
                    const parsedData = {
                        ...data,
                        createdAt: new Date(data.createdAt),
                        updatedAt: new Date(data.updatedAt),
                    };

                    if (!oldData)
                        return {
                            pages: [
                                {
                                    content: [parsedData],
                                    page: {
                                        number: 0,
                                        totalElement: 1,
                                        totalPage: 1,
                                        size: 10,
                                    },
                                },
                            ],
                            pageParams: [0],
                        };
                    return {
                        pages: [
                            ...oldData.pages.slice(0, -2),
                            {
                                ...oldData.pages[oldData.pages.length - 1],
                                content: [
                                    ...oldData.pages[oldData.pages.length - 1]
                                        .content,
                                    parsedData,
                                ],
                            },
                        ],
                        pageParams: oldData.pageParams,
                    };
                },
            );

            queryClient.invalidateQueries({
                queryKey: ["replies", viewpointId],
            });
            if (inputRef.current) inputRef.current.innerHTML = "";
            setInFocusQueue(false);
        },
        onError(error) {
            console.error(error);
            toast.error("發送回覆時發生未知的錯誤，請再試一次");
        },
    });

    // the Editor is ready (rendered) when is in focus
    useEffect(() => {
        setIsEditorReady(inFocus);
    }, [inFocus, setIsEditorReady]);

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

    // To ensure the animation is triggered, we need to make sure animationSeq is not null when inFocus changes
    // Thus, all updates on focus should be done through the inFocusQueue state
    // The animationSeq state is used to trigger the animation, and it will be reset to null after the animation is done
    // And once the animation is triggered (animationSeq is not null), we will set the inFocus state to the inFocusQueue state
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
    }, [animationSeq, setInFocus, inFocusQueue]);

    useEffect(() => {
        if (!inFocus || !inputRef.current) return;
        inputRef.current.focus();
    }, [inFocus, inputRef]);

    const postReplyFn = () => {
        if (inputRef.current === null) return;
        const content = getInputFieldContent();

        postReplyMutation.mutate({
            content,
            quotes: [],
            facts: replyFactList.map((fact) => fact.id),
        });
    };

    return (
        <div
            onClick={() => {
                if (!cookie.auth_token) {
                    toast.info("登入以發表回覆");
                    return;
                }
                setInFocusQueue(true);
            }}
            className="z-20 flex overflow-y-hidden border border-zinc-500 bg-neutral-50 transition-[border-radius,height] duration-200"
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
                            <ActionIcon
                                variant="transparent"
                                className="group disabled:bg-transparent"
                                disabled={!inSelectionMode}
                                onClick={() => setModalId(uuid())}
                            >
                                <LinkIcon className="w-6 text-emerald-600 group-disabled:text-neutral-500" />
                            </ActionIcon>
                            <FactImportModal
                                issueId={issueId}
                                modalId={modalId}
                                setModalId={setModalId}
                                replyFactList={replyFactList}
                                setRelpyFactList={setReplyFactList}
                                addFact={(fact) => {
                                    setReplyFactList((prev) => [...prev, fact]);
                                }}
                            />
                        </div>
                        <ActionIcon
                            variant="transparent"
                            className="group disabled:bg-transparent"
                            disabled={
                                contentEmpty || postReplyMutation.isPending
                            }
                            onClick={postReplyFn}
                        >
                            {postReplyMutation.isPending ? (
                                <Loader
                                    className="text-emerald-600"
                                    size={20}
                                />
                            ) : (
                                <PaperAirplaneIcon className="w-6 text-emerald-600 group-disabled:text-neutral-500" />
                            )}
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
    );
}

export default withErrorBoundary(AuthorReplyBar);
