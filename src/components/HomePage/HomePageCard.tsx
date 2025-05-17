"use client";

import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import type { Issue } from "@/types/conversations.types";
import Link from "next/link";
import {
    BellIcon,
    BookmarkIcon,
    ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import { forwardRef } from "react";
import { ActionIcon } from "@mantine/core";

import { getIssueRead } from "@/lib/requests/issues/getIssueRead";

type HomePageCardProps = {
    issue: Issue;
};

const HomePageCard = forwardRef<HTMLAnchorElement, HomePageCardProps>(
    ({ issue }, ref) => {
        const [cookies] = useCookies(["auth_token"]);

        const { data: readObject } = useQuery({
            queryKey: ["getIssueRead"],
            queryFn: () =>
                getIssueRead({
                    issueId: issue.id,
                    auth_token: cookies.auth_token,
                }),
        });

        return (
            <Link href={`/issues/${issue.id}`} ref={ref} className="space-y-2">
                <h1 className="font-serif text-2xl font-semibold duration-300 group-hover:text-emerald-500">
                    {issue.title}
                </h1>
                <p className="mt-1 whitespace-pre-wrap text-base font-normal">
                    {issue.description.slice(0, 100) + "..."}
                </p>
                <div className="tex flex justify-start gap-2">
                    <div className="flex">
                        <ChatBubbleOvalLeftIcon className="size-6 text-neutral-700" />
                        <div className="ml-1.5 text-base text-neutral-700">
                            {issue.viewpointCount}
                        </div>
                    </div>
                    <ActionIcon
                        variant="transparent"
                        onClick={(e) => e.preventDefault()}
                    >
                        {issue.userFollow && !issue.userFollow.follow ? (
                            <BookmarkIcon className="size-6 text-neutral-700" />
                        ) : readObject?.readStatus ? (
                            <BellIcon className="size-6 text-neutral-700" />
                        ) : (
                            <BellIcon className="size-6 text-emerald-500" />
                        )}
                    </ActionIcon>
                </div>
            </Link>
        );
    },
);

HomePageCard.displayName = "HomePageCard";

export default HomePageCard;
