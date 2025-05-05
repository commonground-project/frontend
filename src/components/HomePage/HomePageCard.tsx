"use client";

import type { Issue } from "@/types/conversations.types";
import Link from "next/link";
import {
    BellIcon,
    BookmarkIcon,
    ChatBubbleOvalLeftIcon,
    BellIcon as __,
} from "@heroicons/react/24/outline";
import { forwardRef } from "react";
import { ActionIcon } from "@mantine/core";

type HomePageCardProps = {
    issue: Issue;
};

const HomePageCard = forwardRef<HTMLAnchorElement, HomePageCardProps>(
    ({ issue }, ref) => {
        return (
            <Link href={`/issues/${issue.id}`} ref={ref} className="space-y-2">
                <h1 className="text-lg font-semibold duration-300 group-hover:text-emerald-500">
                    {issue.title}
                </h1>
                <p className="whitespace-pre-wrap text-base font-normal">
                    {issue.description.slice(0, 100) + "..."}
                </p>
                <div className="flex justify-start gap-2">
                    <div className="flex">
                        <ChatBubbleOvalLeftIcon className="size-6 text-neutral-700" />
                        <p className="ml-1.5 text-base text-neutral-700">
                            {issue.viewpointCount}
                        </p>
                    </div>
                    <ActionIcon variant="transparent">
                        {issue.userFollow && issue.userFollow.follow ? (
                            <BookmarkIcon className="size-6 text-neutral-700" />
                        ) : (
                            <BellIcon className="size-6 text-neutral-700" />
                        )}
                    </ActionIcon>
                </div>
            </Link>
        );
    },
);

HomePageCard.displayName = "HomePageCard";

export default HomePageCard;
