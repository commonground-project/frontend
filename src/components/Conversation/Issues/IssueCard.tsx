"use client";

import { RectangleStackIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import EmptyIssueCard from "@/components/Conversation/Issues/EmptyIssueCard";
import type { Issue } from "@/types/conversations.types";
import { Tooltip } from "@mantine/core";

type IssueCardProps = {
    issue: Issue;
};

export default function IssueCard({ issue }: IssueCardProps) {
    return (
        <div className="mb-6 w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            <h1 className="py-1 font-sans text-2xl font-bold">{issue.title}</h1>
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
                    <p className="text-lg font-normal">{issue.description}</p>
                    <div className="mt-3">
                        <Link
                            href={`/issues/${issue.id}/facts`}
                            className="text-lg font-semibold transition-colors duration-300 hover:text-emerald-500"
                        >
                            查看所有事實
                            <RectangleStackIcon className="ml-1 inline-block h-6 w-6" />
                        </Link>
                    </div>
                </div>
            ) : (
                <EmptyIssueCard issueId={issue.id} />
            )}
        </div>
    );
}
