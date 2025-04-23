"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import { postViewpoint } from "@/lib/requests/issues/postViewpoint";
import { getFact } from "@/lib/requests/facts/getFact";

import ViewpointCard from "@/components/Conversation/Editors/Viewpoints/ViewpointCard";
import FactListCard from "@/components/Conversation/Editors/Viewpoints/FactListCard";
import ReferenceMarkerProvider from "@/components/ReferenceMarker/ReferenceMarkerProvider";
import Footer from "@/components/AppShell/Footer";

import type { Fact, ViewPoint } from "@/types/conversations.types";
import { prependPaginatedQueryData } from "@/lib/utils/prependPaginatedQueryData";
import type { PaginatedPage } from "@/types/requests.types";
import { decodeUserFromString } from "@/lib/auth/staticDecode";

export default function AuthorViewpoint() {
    const params = useParams();
    const router = useRouter();

    const [viewpointTitle, setViewpointTitle] = useState<string>("");
    const viewpointTitleRef = useRef<HTMLInputElement>(null); // to get the newest value
    const phrasedViewpointContent = useRef<string>("");
    const [initialContentEmpty, setInitialContentEmpty] =
        useState<boolean>(true);
    const [viewpointFactList, setViewpointFactList] = useState<Fact[]>([]);

    const [cookie] = useCookies(["auth_token"]);
    const queryClient = useQueryClient();

    const issueId = params.id as string;

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
    const deleteContextFromLocal = useCallback(() => {
        const username = decodeUserFromString(cookie.auth_token)?.username;
        localStorage.removeItem(window.location.pathname + `/${username}`);
    }, [cookie.auth_token]);

    // save the context to local storage
    const saveContextToLocal = useCallback(
        (title: string, content: string, facts: string[]) => {
            const username = decodeUserFromString(cookie.auth_token)?.username;
            // if the viewpoint is empty, do not save
            if (title === "" && content === "" && facts.length === 0) {
                deleteContextFromLocal();
                return;
            }
            localStorage.setItem(
                window.location.pathname + `/${username}`,
                JSON.stringify({
                    title,
                    content,
                    facts,
                }),
            );
        },
        [cookie.auth_token, deleteContextFromLocal],
    );

    const publishViewpoint = () => {
        postNewViewpoint.mutate({
            title: viewpointTitle,
            content: phrasedViewpointContent.current,
            facts: viewpointFactList.map((fact) => fact.id),
        });
    };

    return (
        <main className="h-full w-full bg-neutral-50 px-6 pt-3 md:px-0 md:pt-0">
            <div className="flex h-full w-full">
                {/* 157px = 56px(header) + 69px(margin-top between header and this div) + 32px(padding-bottom of main)*/}
                <ReferenceMarkerProvider
                    factHintTooltip="從右側選取引註事實"
                    historyRecord={phrasedViewpointContent.current}
                >
                    <div className="flex w-full justify-center md:w-2/3 md:pb-10 md:pt-8">
                        <div className="w-full max-w-[700px]">
                            <ViewpointCard
                                issueId={issueId}
                                viewpointTitle={viewpointTitle}
                                viewpointTitleRef={viewpointTitleRef}
                                setViewpointTitle={setViewpointTitle}
                                phrasedContent={phrasedViewpointContent}
                                viewpointFactList={viewpointFactList}
                                saveContextToLocal={saveContextToLocal}
                                deleteContextFromLocal={deleteContextFromLocal}
                                publishViewpoint={publishViewpoint}
                                initialContentEmpty={initialContentEmpty}
                                pendingPublish={
                                    postNewViewpoint.status === "pending"
                                }
                            />
                        </div>
                    </div>
                    <div className="hidden h-full border-l border-neutral-400 md:block" />
                    <div className="hidden md:block md:w-1/3 md:pb-10 md:pt-8">
                        <FactListCard
                            issueId={issueId}
                            viewpointTitle={
                                viewpointTitleRef.current?.value ?? ""
                            }
                            viewpointFactList={viewpointFactList}
                            setViewpointFactList={setViewpointFactList}
                            saveContextToLocal={saveContextToLocal}
                        />
                    </div>
                </ReferenceMarkerProvider>
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-10 md:hidden">
                <Footer />
            </div>
        </main>
    );
}
