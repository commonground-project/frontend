"use client";

import { useState } from "react";
import type { getIssueViewpointsResponse } from "@/lib/requests/issues/getIssueViewpoints";
import { toast } from "sonner";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";

import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";

import { postViewpoint } from "@/lib/requests/issues/postViewpoint";

import ViewpointCard from "@/components/AuthorViewpoint/ViewpointCard";
import FactListCard from "@/components/AuthorViewpoint/FactListCard";

import type { Fact } from "@/types/conversations.types";
import { prependPaginatedQueryData } from "@/lib/utils/prependPaginatedQueryData";

export default function AuthorViewpoint() {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [viewpointTitle, setViewpointTitle] = useState<string>("");
    const [viewpointFactList, setViewpointFactList] = useState<Fact[]>([]);
    const [cookie] = useCookies(["auth_token"]);

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
            toast.success("觀點發表成功");

            queryClient.setQueryData(
                ["viewpoints", issueId],
                (olddata: {
                    pages: getIssueViewpointsResponse[];
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

    const publishViewpoint = (content: string[]) => {
        const parsedContent = content.map((p) =>
            p.replace(/(\s?)\[(\d+)\]/g, (_, space, num) =>
                space ? `[ ](${num - 1})` : `[ ](${num - 1})`,
            ),
        );
        postNewViewpoint.mutate({
            title: viewpointTitle,
            content: parsedContent.join("\n"),
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
                <div className="w-2/3">
                    <ViewpointCard
                        issueId={issueId}
                        viewpointTitle={viewpointTitle}
                        setViewpointTitle={setViewpointTitle}
                        publishViewpoint={publishViewpoint}
                        pendingPublish={postNewViewpoint.status === "pending"}
                    />
                </div>
                <div className="w-1/3">
                    <FactListCard
                        issueId={issueId}
                        viewpointFactList={viewpointFactList}
                        setViewpointFactList={setViewpointFactList}
                    />
                </div>
            </div>
        </main>
    );
}
