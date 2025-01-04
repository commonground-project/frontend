"use client";
import { useParams, useRouter } from "next/navigation";
import ViewpointCard from "@/components/AuthorViewpoint/ViewpointCard";
import FactListCard from "@/components/AuthorViewpoint/FactListCard";
import { useState } from "react";
import { Fact } from "@/types/conversations.types";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { postViewpoint } from "@/lib/requests/issues/postViewpoint";
import { getIssueViewpointsResponse } from "@/lib/requests/issues/getIssueViewpoints";
import { useCookies } from "react-cookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AuthorViewpoint() {
    const params = useParams();
    const router = useRouter();
    const [viewpointTitle, setViewpointTitle] = useState<string>("");
    const [viewpointContent, setViewpointContent] = useState<string>("");
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
            toast.success("觀點發表成功");

            queryClient.setQueryData(
                ["viewpoints", issueId],
                (olddata: {
                    pages: getIssueViewpointsResponse[];
                    pageParams: number[];
                }) => {
                    const newQueryData = olddata.pages;
                    newQueryData[0].content = [
                        data,
                        ...newQueryData[0].content,
                    ];
                    return {
                        pages: newQueryData,
                        pageParams: olddata.pageParams,
                    };
                },
            );

            queryClient.invalidateQueries({
                queryKey: ["viewpoints", issueId],
            });

            router.push(`/issues/${issueId}`);
        },
        onError(error) {
            console.error(`error creating viewpoints: ${error}`);
            toast.error("發表觀點時發生錯誤，請再試一次");
        },
    });

    const publishViewpoint = () => {
        console.log("Publishing viewpoint");

        postNewViewpoint.mutate({
            title: viewpointTitle,
            content: viewpointContent,
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
                        setViewpointContent={setViewpointContent}
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
