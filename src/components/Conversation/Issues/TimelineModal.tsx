"use client";

import { Modal, Timeline } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";
import type { TimelineNode } from "@/lib/requests/timeline/getIssueTimeline";

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
    return (
        <Modal
            opened={isOpen}
            onClose={() => setIsOpen(false)}
            title={<h1 className="font-bold">{`《${issueTitle}》的演進`}</h1>}
            classNames={{
                content: "w-[620px]",
            }}
        >
            <Timeline
                color="black"
                lineWidth={2}
                bulletSize={8}
                active={3}
                classNames={{
                    root: "pl-[32px]",
                    itemBody: "ml-[16px]",
                }}
            >
                {timeline.map((node) => (
                    <Timeline.Item
                        key={node.id}
                        bullet={
                            <div className="relative flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="8"
                                    height="8"
                                    viewBox="0 0 8 8"
                                    fill="none"
                                >
                                    <circle
                                        cx="4"
                                        cy="4"
                                        r="4"
                                        fill="#262626"
                                    />
                                </svg>
                                <hr className="absolute right-[-16px] h-[1px] w-[16px] border-black"></hr>
                            </div>
                        }
                        title={node.title}
                    >
                        {node.description}
                    </Timeline.Item>
                ))}
            </Timeline>
        </Modal>
    );
}
