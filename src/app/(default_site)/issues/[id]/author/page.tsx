"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";

import { postViewpoint } from "@/lib/requests/issues/postViewpoint";

import ViewpointCard from "@/components/Conversation/Editors/Viewpoints/ViewpointCard";
import FactListCard from "@/components/Conversation/Editors/Viewpoints/FactListCard";
import ReferenceMarkerProvider from "@/components/ReferenceMarker/ReferenceMarkerProvider";

import type { Fact, ViewPoint } from "@/types/conversations.types";
import { prependPaginatedQueryData } from "@/lib/utils/prependPaginatedQueryData";
import type { PaginatedPage } from "@/types/requests.types";

export default function AuthorViewpoint() {
    const params = useParams();
    const router = useRouter();

    const [viewpointTitle, setViewpointTitle] = useState<string>("");
    const [viewpointFactList, setViewpointFactList] = useState<Fact[]>([]);
    // const [inSelectionMode, setInSelectionMode] = useState<boolean>(false);
    // const [curReferenceMarkerId, setCurReferenceMarkerId] = useState<
    //     number | null
    // >(null);
    // const [avaliableMarkerId, setAvaliableMarkerId] = useState<number>(0);

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

    const publishViewpoint = (content: string) => {
        console.log("content : ", content);

        postNewViewpoint.mutate({
            title: viewpointTitle,
            content: content,
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
                <ReferenceMarkerProvider>
                    <div className="w-2/3">
                        <ViewpointCard
                            issueId={issueId}
                            viewpointTitle={viewpointTitle}
                            setViewpointTitle={setViewpointTitle}
                            publishViewpoint={publishViewpoint}
                            pendingPublish={
                                postNewViewpoint.status === "pending"
                            }
                            // setInSelectionMode={setInSelectionMode}
                            // curReferenceMarkerId={curReferenceMarkerId}
                            // setCurReferenceMarkerId={setCurReferenceMarkerId}
                            // avaliableMarkerId={avaliableMarkerId}
                            // setAvaliableMarkerId={setAvaliableMarkerId}
                        />
                    </div>
                    <div className="w-1/3">
                        <FactListCard
                            issueId={issueId}
                            viewpointFactList={viewpointFactList}
                            setViewpointFactList={setViewpointFactList}
                            // inSelectionMode={inSelectionMode}
                            // curReferenceMarkerId={curReferenceMarkerId}
                            // avaliableMarkerId={avaliableMarkerId}
                        />
                    </div>
                </ReferenceMarkerProvider>
            </div>
        </main>
    );
}
