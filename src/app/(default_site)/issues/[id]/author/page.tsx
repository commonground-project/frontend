"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";

import { postViewpoint } from "@/lib/requests/issues/postViewpoint";
import { getFact } from "@/lib/requests/facts/getFact";

import ViewpointCard from "@/components/Conversation/Editors/Viewpoints/ViewpointCard";
import FactListCard from "@/components/Conversation/Editors/Viewpoints/FactListCard";
import ReferenceMarkerProvider from "@/components/ReferenceMarker/ReferenceMarkerProvider";

import type { Fact, ViewPoint } from "@/types/conversations.types";
import { prependPaginatedQueryData } from "@/lib/utils/prependPaginatedQueryData";
import type { PaginatedPage } from "@/types/requests.types";
import { decodeUserFromString } from "@/lib/auth/staticDecode";

export default function AuthorViewpoint() {
    const params = useParams();
    const router = useRouter();

    const [viewpointTitle, setViewpointTitle] = useState<string>("");
    const viewpointTitleRef = useRef<string>("");
    const phrasedViewpointContent = useRef<string>("");
    const [initialContentEmpty, setInitialContentEmpty] =
        useState<boolean>(true);
    const [viewpointFactList, setViewpointFactList] = useState<Fact[]>([]);
    const viewpointFactListRef = useRef<Fact[]>([]);

    const [cookie] = useCookies(["auth_token"]);
    const queryClient = useQueryClient();

    const issueId = params.id as string;

    // update the ref when the state changes
    useEffect(() => {
        viewpointTitleRef.current = viewpointTitle;
    }, [viewpointTitle]);

    useEffect(() => {
        viewpointFactListRef.current = viewpointFactList;
    }, [viewpointFactList]);

    const postNewViewpoint = useMutation({
        mutationKey: ["postNewViewpoint", issueId],
        mutationFn: ({
            title,
            content,
            facts,
        }: {
            title: string;
            content: string;
            facts: string[];
        }) =>
            postViewpoint({
                issueId: issueId,
                auth_token: cookie.auth_token,
                title: title,
                content: content,
                facts: facts,
            }),

        onSuccess(data) {
            queryClient.setQueryData(
                ["viewpoints", issueId],
                (olddata: {
                    pages: PaginatedPage<ViewPoint>[];
                    pageParams: number[];
                }) => {
                    if (!olddata) return;
                    const updatedData = prependPaginatedQueryData(
                        data,
                        olddata.pages,
                    );
                    return {
                        pages: updatedData,
                        pageParams: updatedData.map(
                            (__: unknown, i: number) => i,
                        ),
                    };
                },
            );

            queryClient.invalidateQueries({
                queryKey: ["viewpoints", issueId],
            });

            deleteContextFromLocal();

            toast.success("觀點發表成功");
            router.push(`/issues/${issueId}`);
        },
        onError(error: Record<string, Record<string, string>> | Error) {
            if (typeof error === "object" && "data" in error) {
                if (error.data.type == "type:VALIDATION_ERROR") {
                    toast.error("驗證錯誤", {
                        description: "你有任何引註數字打錯嗎？",
                    });
                    return;
                }
            }
            toast.error("發表觀點時發生錯誤，請再試一次");
        },
    });

    const getFactById = useMutation({
        mutationKey: ["getFactById"],
        mutationFn: (factId: string) =>
            getFact({
                factId: factId,
                auth_token: cookie.auth_token,
            }),

        onSuccess(data) {
            setViewpointFactList((prev) => {
                const isFactExist = prev.find((fact) => fact.id === data.id);
                if (isFactExist) return prev;
                return [...prev, data];
            });
        },
    });

    // Wrap "getFactById.mutate" with useCallback
    const restoreFacts = useCallback(
        (factIds: string[]) => {
            factIds.forEach((factId) => getFactById.mutate(factId));
        },
        [getFactById], // Only depend on `mutate`, not the entire `getFactById`
    );

    // save the context to local storage
    const saveContextToLocal = () => {
        // if the viewpoint is empty, do not save
        if (
            viewpointTitleRef.current === "" &&
            phrasedViewpointContent.current === "" &&
            viewpointFactListRef.current.length === 0
        ) {
            deleteContextFromLocal();
            return;
        }
        const username = decodeUserFromString(cookie.auth_token)?.username;
        localStorage.setItem(
            window.location.pathname + `/${username}`,
            JSON.stringify({
                title: viewpointTitleRef.current, // use ref to get the latest value
                content: phrasedViewpointContent.current,
                facts: viewpointFactListRef.current.map((fact) => fact.id),
            }),
        );
    };

    // restore the context from local storage
    useEffect(() => {
        console.log("restore context");
        const username = decodeUserFromString(cookie.auth_token)?.username;
        const savedContext = localStorage.getItem(
            window.location.pathname + `/${username}`,
        );
        if (savedContext) {
            const parsedContext = JSON.parse(savedContext);
            // restore the viewpoint title
            setViewpointTitle(parsedContext.title);
            // restore the viewpoint content
            phrasedViewpointContent.current = parsedContext.content;
            setInitialContentEmpty(parsedContext.content === "");
            // restore the viewpoint facts
            restoreFacts(parsedContext.facts);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // delete the context from local storage
    const deleteContextFromLocal = () => {
        const username = decodeUserFromString(cookie.auth_token)?.username;
        localStorage.removeItem(window.location.pathname + `/${username}`);
    };

    const publishViewpoint = () => {
        postNewViewpoint.mutate({
            title: viewpointTitle,
            content: phrasedViewpointContent.current,
            facts: viewpointFactList.map((fact) => fact.id),
        });
    };

    return (
        <main className="mx-auto my-8 w-full max-w-7xl">
            <Link
                href={`/issues/${issueId}`}
                className="mb-2 ml-7 flex w-[100px] items-center text-lg font-semibold text-neutral-500 duration-300 hover:text-emerald-500"
            >
                <ArrowLongLeftIcon className="mr-1 inline-block h-6 w-6" />
                返回議題
            </Link>
            <div className="flex h-[calc(100hv-157px)] w-full items-stretch gap-7">
                {/* 157px = 56px(header) + 69px(margin-top between header and this div) + 32px(padding-bottom of main)*/}
                <ReferenceMarkerProvider
                    historyRecord={phrasedViewpointContent.current}
                >
                    <div className="w-2/3">
                        <ViewpointCard
                            issueId={issueId}
                            viewpointTitle={viewpointTitle}
                            setViewpointTitle={setViewpointTitle}
                            phrasedContent={phrasedViewpointContent}
                            saveContextToLocal={saveContextToLocal}
                            deleteContextFromLocal={deleteContextFromLocal}
                            publishViewpoint={publishViewpoint}
                            initialContentEmpty={initialContentEmpty}
                            pendingPublish={
                                postNewViewpoint.status === "pending"
                            }
                        />
                    </div>
                    <div className="w-1/3">
                        <FactListCard
                            issueId={issueId}
                            viewpointFactList={viewpointFactList}
                            setViewpointFactList={setViewpointFactList}
                            saveContextToLocal={saveContextToLocal}
                        />
                    </div>
                </ReferenceMarkerProvider>
            </div>
        </main>
    );
}
