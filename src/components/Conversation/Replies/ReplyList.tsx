"use client";

import ReplyCard from "./ReplyCard";
import { Fragment, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getViewpointReplies } from "@/lib/requests/replies/getViewpointReplies";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import EmptyReplyCard from "../Issues/EmptyReplySection";
import { useInView } from "react-intersection-observer";
import ReplySkeleton from "./ReplySkeleton";
import withErrorBoundary from "@/components/AppShell/WithErrorBoundary";

type ReplyListProps = {
    viewpointId: string;
};

export function ReplyList({ viewpointId }: ReplyListProps) {
    const [cookies] = useCookies(["auth_token"]);

    const { data, error, isFetching, fetchNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: ["replies", viewpointId],
            queryFn: ({ pageParam }) =>
                getViewpointReplies(viewpointId, pageParam, cookies.auth_token),
            initialPageParam: 0,
            getNextPageParam: (lastPage) => {
                if (lastPage.page.number + 1 < lastPage.page.totalPage)
                    return lastPage.page.number + 1;
            },
        });

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    useEffect(() => {
        if (!error) return;
        toast.error("無法獲取回覆列表，請重新整理頁面");
    }, [error]);

    useEffect(() => {
        if (!inView || isFetching || !hasNextPage) return;
        fetchNextPage();
    }, [inView, isFetching, hasNextPage, fetchNextPage]);

    if (error) return null;

    return (
        <div className="rounded-xl bg-neutral-100 px-7 py-6">
            <h1 className="mb-2 text-xl font-semibold">查看所有回覆</h1>
            <div className="mt-2 flex flex-col gap-3">
                {data &&
                    data.pages.map((page, pageIndex, pageArr) =>
                        page.content.map((reply, replyIndex, replyArr) => {
                            const isLastReply =
                                pageIndex === pageArr.length - 1 &&
                                replyIndex === replyArr.length - 1;
                            return (
                                <Fragment key={reply.id}>
                                    <ReplyCard
                                        ref={isLastReply ? ref : null}
                                        reply={reply}
                                    />
                                    {(!isLastReply || isFetching) && (
                                        <hr className="w-full border-t border-neutral-700" />
                                    )}
                                </Fragment>
                            );
                        }),
                    )}
                {isFetching && <ReplySkeleton />}
                {data && data.pages[0].content.length === 0 && (
                    <EmptyReplyCard />
                )}
            </div>
        </div>
    );
}

export default withErrorBoundary(ReplyList);
