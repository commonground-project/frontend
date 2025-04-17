"use client";

import {
    RectangleStackIcon,
    InformationCircleIcon,
    FilmIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import EmptyIssueCard from "@/components/Conversation/Issues/EmptyIssueCard";
import type { Issue } from "@/types/conversations.types";
import { Tooltip, Button } from "@mantine/core";
import { useState } from "react";
import TimelineModal from "@/components/Conversation/Issues/TimelineModal";
import withErrorBoundary from "@/components/AppShell/WithErrorBoundary";

type IssueCardProps = {
    issue: Issue;
};

export function IssueCard({ issue }: IssueCardProps) {
    const [isTimelimeModalOpen, setIsTimelimeModalOpen] = useState(false);

    return (
        <div className="rounded-md bg-neutral-100 p-5 text-black">
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
                    <p className="whitespace-pre-wrap text-lg font-normal">
                        {issue.description}
                    </p>
                    <div className="mt-3">
                        <Link
                            href={`/issues/${issue.id}/facts`}
                            className="mt-3 text-lg font-semibold transition-colors duration-300 hover:text-emerald-500"
                        >
                            查看所有事實
                            <RectangleStackIcon className="ml-1 inline-block h-6 w-6" />
                        </Link>
                    </div>
                    <div className="mt-2">
                        <Button
                            variant="transparent"
                            className="p-0 text-lg font-semibold text-black transition-colors duration-300 hover:text-emerald-500"
                            onClick={() => {
                                setIsTimelimeModalOpen(true);
                                console.log("查看事件演進");
                            }}
                        >
                            查看事件演進
                            <FilmIcon className="ml-1 inline-block h-6 w-6" />
                        </Button>
                    </div>
                    <TimelineModal
                        isOpen={isTimelimeModalOpen}
                        setIsOpen={setIsTimelimeModalOpen}
                        issueId={issue.id}
                        issueTitle={issue.title}
                    />
                </div>
            ) : (
                <EmptyIssueCard issueId={issue.id} />
            )}
        </div>
    );
}

export default withErrorBoundary(IssueCard);
