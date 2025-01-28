"use client";

import { Modal, Timeline } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import type { TimelineNode } from "@/types/conversations.types";
import { ArrowDownIcon } from "@heroicons/react/16/solid";

type TimeLineModalProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    issueTitle: string;
    timeline: TimelineNode[];
};

export default function TimeLineModal({
    isOpen,
    setIsOpen,
    issueTitle,
    timeline,
}: TimeLineModalProps) {
    const sortedTimeline = timeline.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

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
        </Modal>
    );
}
