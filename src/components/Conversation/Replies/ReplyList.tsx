"use client";

import { motion } from "motion/react";
import ReplyCard from "./ReplyCard";
import { Fragment, useEffect, useState } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { getViewpointReplies } from "@/lib/requests/replies/getViewpointReplies";
import { followViewpoint } from "@/lib/requests/viewpoints/followViewpoint";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import { Button, Drawer, Modal } from "@mantine/core";
import { BellAlertIcon } from "@heroicons/react/16/solid";
import EmptyReplyCard from "../Issues/EmptyReplySection";
import { useInView } from "react-intersection-observer";
import ReplySkeleton from "./ReplySkeleton";
import posthog from "posthog-js";
import withErrorBoundary from "@/lib/utils/withErrorBoundary";

type ReplyListProps = {
    viewpointId: string;
};

function ReplyList({ viewpointId }: ReplyListProps) {
    const [cookies] = useCookies(["auth_token"]);
    const [isFollowing, setIsFollowing] = useState(true);
    const [rotate, setRotate] = useState(isFollowing ? 0 : 180);
    const [isFollowConfirmOpen, setIsFollowConfirmOpen] = useState(false);

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

    const followViewpointMutation = useMutation({
        mutationKey: ["followViewpoint"],
        mutationFn: async () => {
            if (!cookies.auth_token) return;
            const res = await followViewpoint({
                viewpointId,
                auth_token: cookies.auth_token,
            });
            return res;
        },
        onSuccess: (data) => {
            if (!data) return;
            setIsFollowing(data.follow);

            if (data.follow) {
                setRotate(0);
            } else {
                setRotate(180);
            }
        },
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
        <>
            <div className="rounded-xl bg-neutral-50 px-7 py-6">
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
            {data && (
                <Button
                    variant="white"
                    className="mt-4 h-10 w-full"
                    radius="md"
                    onClick={() => {
                        posthog.capture("commonground");
                        setRotate((prev) => prev + 180);
                        if (isFollowing) {
                            setTimeout(
                                () => setIsFollowConfirmOpen((prev) => !prev),
                                550,
                            );
                        }
                    }}
                >
                    <div className="grid size-6 grid-cols-2 grid-rows-2 gap-[1px] p-[2px]">
                        <img src="/assets/LogoLeftTop.svg" alt="" />
                        <img
                            src="/assets/LogoLeftTop.svg"
                            alt=""
                            className="-scale-x-100"
                        />
                        <img
                            src="/assets/LogoLeftTop.svg"
                            alt=""
                            className="-scale-y-100"
                        />
                        <motion.div
                            animate={{ rotate }}
                            transition={{
                                type: "spring",
                                bounce: 0,
                                duration: 1,
                            }}
                        >
                            <img src="/assets/LogoLeftTop.svg" alt="" />
                        </motion.div>
                    </div>
                    <div className="ml-2 text-sm font-medium text-black">
                        找到了 CommonGround
                    </div>
                </Button>
            )}
            <Drawer
                opened={isFollowConfirmOpen}
                onClose={() => setIsFollowConfirmOpen(false)}
                className="block md:hidden"
                padding="xl"
                size="sm"
                position="bottom"
                withCloseButton={false}
            >
                <div className="flex w-full flex-col items-center gap-7">
                    <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500 p-2">
                        <BellAlertIcon className="size-9 fill-white" />
                    </div>
                    <div className="text-2xl font-semibold text-black">
                        持續關注此議題嗎？
                    </div>
                    <div className="flex w-full gap-3">
                        <Button
                            color="#E5E5E5"
                            className="h-12 w-1/2 text-lg font-normal text-black"
                            // TODO: check if the user have already follow the viewpoint
                            onClick={() => setIsFollowConfirmOpen(false)}
                        >
                            持續關注
                        </Button>
                        <Button
                            className="h-12 w-1/2 text-lg font-normal text-white"
                            onClick={() => {
                                setIsFollowConfirmOpen(false);
                                // TODO: check if the user have already follow the viewpoint
                                followViewpointMutation.mutate();
                            }}
                        >
                            取消關注
                        </Button>
                    </div>
                </div>
            </Drawer>
            <Modal
                opened={isFollowConfirmOpen}
                onClose={() => setIsFollowConfirmOpen(false)}
                className="hidden md:block"
                classNames={{
                    title: "text-lg",
                }}
                padding="xl"
                size="md"
                centered
                title="持續關注討論"
            >
                <div className="h-full">
                    <div className="text-base">
                        在找到共識後，會想持續收到關於此討論的通知嗎？
                    </div>
                    <div className="mt-6 flex w-full justify-end gap-3">
                        <Button
                            variant="outline"
                            className="h-8 font-normal text-black"
                            // TODO: check if the user have already follow the viewpoint
                            onClick={() => {
                                setIsFollowConfirmOpen(false);
                            }}
                        >
                            持續關注
                        </Button>
                        <Button
                            className="h-8 font-normal text-white"
                            onClick={() => {
                                setIsFollowConfirmOpen(false);
                                // TODO: check if the user have already follow the viewpoint
                                followViewpointMutation.mutate();
                            }}
                        >
                            取消關注
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default withErrorBoundary(ReplyList);
