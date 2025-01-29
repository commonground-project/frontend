"use client";

import { Modal, Timeline } from "@mantine/core";
import { Dispatch, SetStateAction, useMemo } from "react";
import { ArrowDownIcon } from "@heroicons/react/16/solid";
import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { getIssueTimeline } from "@/lib/requests/timeline/getIssueTimeline";
import { toast } from "sonner";
import TimelineSkeleton from "@/components/Conversation/Issues/TimelineSkeleton";
import EmptyTimeline from "@/components/Conversation/Issues/EmptyTimeline";

type TimeLineModalProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    issueId: string;
    issueTitle: string;
};

export default function TimeLineModal({
    isOpen,
    setIsOpen,
    issueId,
    issueTitle,
}: TimeLineModalProps) {
    const [cookie] = useCookies(["auth_token"]);

    const { isPending, error, data } = useQuery({
        queryKey: ["issueTimeline", issueId],
        queryFn: () =>
            getIssueTimeline({ issueId, user_token: cookie.auth_token }),
    });

    const sortedTimeline = useMemo(() => {
        if (!data) return [];
        return data.content.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
    }, [data]);

    if (error) {
        toast.error("載入事件時間軸時發生問題，請再試一次");
        return null;
    }

    return (
        <Modal
            opened={isOpen}
            onClose={() => setIsOpen(false)}
            title={`《${issueTitle}》的演進`}
            size="620px"
            classNames={{
                title: "font-bold",
            }}
        >
            {isPending ? (
                <TimelineSkeleton />
            ) : sortedTimeline.length === 0 ? (
                <EmptyTimeline />
            ) : (
                <Timeline
                    color="black"
                    lineWidth={2}
                    bulletSize={8}
                    active={sortedTimeline.length}
                    classNames={{
                        root: "pl-[32px]",
                        itemBody: "ml-[16px]",
                    }}
                >
                    {sortedTimeline.map((node) => (
                        <Timeline.Item
                            key={node.id}
                            bullet={
                                <div className="relative flex items-center">
                                    <hr className="absolute right-[-16px] h-[1px] w-[16px] border-black"></hr>
                                </div>
                            }
                            title={`${node.date.toLocaleDateString()} ${node.title}`}
                        >
                            {node.description}
                        </Timeline.Item>
                    ))}
                    <Timeline.Item
                        bullet={
                            <div className="relative">
                                <div className="absolute -left-1 -top-1 h-2 w-2 bg-white" />
                                <ArrowDownIcon className="absolute -left-2 -top-2 h-4 w-4 text-black" />
                            </div>
                        }
                    />
                </Timeline>
            )}
        </Modal>
    );
}
