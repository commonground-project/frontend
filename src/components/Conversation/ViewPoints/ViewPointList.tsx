"use client";
import EmptyViewPointCard from "@/components/Conversation/ViewPoints/EmptyViewPointSection";
import ViewPointCard from "@/components/Conversation/ViewPoints/ViewPointCard";
import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@mantine/core";
import { toast } from "sonner";

type ViewPointListProps = {
    issueId: string;
};

export default function ViewPointList({ issueId }: ViewPointListProps) {
    const { ref, inView } = useInView();

    const [cookie] = useCookies();

    const fetchViewpoints = async ({ pageParam }: { pageParam: number }) => {
        const auth_token = cookie.auth_token;

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}/viewpoints?size=10&page=${pageParam}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth_token}`,
                },
            },
        );
        return res.json();
    };

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["viewpoints", issueId],
        queryFn: fetchViewpoints,
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

    if (error) {
        toast.error("無法取得觀點資訊，請再試一次或是檢查網路連線");
        return <h1>無法取得觀點資訊，請再試一次或是檢查網路連線</h1>;
    }

    return (
        <div className="w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            <h1 className="mb-2 text-xl font-semibold">查看所有觀點</h1>
            {data?.pages[0].content.length == 0 ? (
                <EmptyViewPointCard id={issueId} />
            ) : (
                <div className="flex-col">
                    {data?.pages
                        .map((page) => page.content)
                        .flat()
                        .map((viewpoint, index, array) => (
                            <div
                                key={viewpoint.id}
                                ref={index === array.length - 1 ? ref : null}
                            >
                                <ViewPointCard viewpoint={viewpoint} />
                                {index !== array.length - 1 && (
                                    <hr className="my-4 w-full border-neutral-500" />
                                )}
                            </div>
                        ))}
                    {status === "pending" && (
                        <Skeleton height={100} width={728} />
                    )}
                </div>
            )}
        </div>
    );
}
