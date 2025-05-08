"use client";

import { toast } from "sonner";
import {
    InformationCircleIcon,
    NewspaperIcon,
    BookmarkIcon as BookMarkOutline,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookMarkSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import EmptyIssueCard from "@/components/Conversation/Issues/EmptyIssueCard";
import MarkdownWithStyle from "@/components/Conversation/Shared/MarkdownWithStyle";
import type { Issue } from "@/types/conversations.types";
import { Tooltip } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { followIssue } from "@/lib/requests/issues/followIssue";
import withErrorBoundary from "@/lib/utils/withErrorBoundary";

type IssueCardProps = {
    issue: Issue;
};

function IssueCard({ issue }: IssueCardProps) {
    const [isFollowing, setIsFollowing] = useState(false);
    const pendingFollow = useRef<boolean | null>(null);
    const [cookies] = useCookies(["auth_token"]);

    useEffect(() => {
        setIsFollowing(issue.userFollow.follow);
    }, [issue.userFollow.follow]);

    const { mutate: follow } = useMutation({
        mutationKey: ["followIssue", issue.id],
        mutationFn: (follow: boolean) => {
            console.log("followIssue");
            return followIssue({
                issueId: issue.id,
                auth_token: cookies.auth_token,
                follow: follow,
            });
        },
        onMutate: (follow) => {
            pendingFollow.current = follow;
            const previousState = isFollowing;
            setIsFollowing(follow);
            return previousState;
        },
        onSuccess: (data) => {
            if (pendingFollow.current === data.follow) {
                setIsFollowing(data.follow);
                pendingFollow.current = null;
            }
        },
        onError: (__err, __variables, context) => {
            if (context !== undefined) {
                setIsFollowing(context);
            }
            pendingFollow.current = null;

            // Toast error message
            const truncatedTitle =
                issue.title.length > 10
                    ? `${issue.title.slice(0, 10)}...`
                    : issue.title;
            toast.error(`關注觀點「${truncatedTitle}」時發生錯誤，請再試一次`);
        },
    });

    return (
        <div className="rounded-md bg-neutral-100 p-5 text-black">
            <h1 className="py-1 font-serif text-2xl font-bold">
                {issue.title}
            </h1>
            {issue.description !== "" ? (
                <div className="mt-3">
                    <div className="mb-1 flex items-center">
                        <h1 className="inline text-lg font-semibold">
                            事件簡述
                        </h1>
                        <Tooltip
                            position="right-start"
                            label="事件簡述由 AI 根據此議題內的事實與其引註資料產生，有可能包含錯誤的內容"
                            events={{ hover: true, focus: true, touch: false }}
                            offset={{ mainAxis: 5, crossAxis: -10 }}
                        >
                            <InformationCircleIcon className="ml-1 inline-block h-5 w-5" />
                        </Tooltip>
                    </div>
                    <div className="hidden md:block">
                        <MarkdownWithStyle content={issue.description} />
                    </div>
                    <div className="block md:hidden">
                        <MarkdownWithStyle
                            content={issue.description}
                            h1Size="lg"
                            h2Size="lg"
                            textSize="base"
                        />
                    </div>

                    <div className="mt-3 flex items-center gap-1">
                        <Link
                            href={`/issues/${issue.id}/facts`}
                            className="flex h-10 w-1/2 items-center justify-center gap-1 rounded-lg bg-neutral-200 py-2 text-lg font-semibold text-neutral-800 md:w-auto md:bg-transparent"
                        >
                            <NewspaperIcon className="ml-1 inline-block h-6 w-6" />
                            <div className="block md:hidden">查看所有事實</div>
                        </Link>
                        <button
                            className="flex h-10 w-1/2 items-center justify-center gap-1 rounded-lg bg-neutral-200 py-2 text-lg font-semibold text-neutral-800 md:w-auto md:bg-transparent"
                            onClick={() => follow(!isFollowing)}
                        >
                            {isFollowing ? (
                                <>
                                    <BookMarkSolid className="ml-1 inline-block h-6 w-6" />
                                    <div className="block md:hidden">
                                        取消關注
                                    </div>
                                </>
                            ) : (
                                <>
                                    <BookMarkOutline className="ml-1 inline-block h-6 w-6" />
                                    <div className="block md:hidden">
                                        關注議題
                                    </div>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <EmptyIssueCard
                    isFollowing={isFollowing}
                    setIsFollowing={setIsFollowing}
                    issueId={issue.id}
                />
            )}
        </div>
    );
}

export default withErrorBoundary(IssueCard);
