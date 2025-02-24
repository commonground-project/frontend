"use client";
import EmptyViewpointCard from "@/components/Conversation/Viewpoints/EmptyViewpointSection";
import ViewpointCard from "@/components/Conversation/Viewpoints/ViewpointCard";
import { useEffect, useLayoutEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";
import { getIssueViewpoints } from "@/lib/requests/viewpoints/getIssueViewpoints";
import ViewpointSkeleton from "./ViewpointSkeleton";

type ViewPointListProps = {
    issueId: string;
};

export default function ViewPointList({ issueId }: ViewPointListProps) {
    const { ref, inView } = useInView();

    const [cookie] = useCookies(["auth_token"]);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["viewpoints", issueId],
        queryFn: ({ pageParam }) =>
            getIssueViewpoints({
                issueId,
                pageParam,
                auth_token: cookie.auth_token,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.page.number + 1 < lastPage.page.totalPage)
                return lastPage.page.number + 1;
        },
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // if the page is loaded with a hash, scroll to the element with that id
    // after the page is loaded
    useLayoutEffect(() => {
        if (status === "success") {
            requestAnimationFrame(() => {
                const hash = window.location.hash.substring(1);
                if (hash) {
                    const targetElement = document.getElementById(hash);
                    console.log("Found element:", targetElement);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: "smooth" });
                    }
                }
            });
        }
    }, [status]);

    if (error) {
        toast.error("無法取得觀點資訊，請再試一次或是檢查網路連線");
        return <h1>無法取得觀點資訊，請再試一次或是檢查網路連線</h1>;
    }

    return (
        <div className="w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            <h1 className="mb-2 text-xl font-semibold">查看所有觀點</h1>
            {data?.pages[0].content.length === 0 ? (
                <EmptyViewpointCard id={issueId} />
            ) : (
                <div className="flex-col">
                    {data?.pages
                        .flatMap((page) => page.content)
                        .map((viewpoint, index, array) => (
                            <div
                                key={viewpoint.id}
                                ref={index === array.length - 1 ? ref : null}
                            >
                                <ViewpointCard
                                    issueId={issueId}
                                    viewpoint={viewpoint}
                                />
                                {index !== array.length - 1 && (
                                    <hr className="my-4 w-full border-neutral-500" />
                                )}
                            </div>
                        ))}
                    {status === "pending" && <ViewpointSkeleton />}
                </div>
            )}
        </div>
    );
}
