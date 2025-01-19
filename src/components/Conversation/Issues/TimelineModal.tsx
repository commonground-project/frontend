"use client";

import { Modal, Timeline } from "@mantine/core";
import type { Dispatch, SetStateAction } from "react";

type TimeLineModalProps = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    issueTitle: string;
};

export default function TimeLineModal({
    isOpen,
    setIsOpen,
    issueTitle,
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
            <Timeline color="black" lineWidth={2} bulletSize={9} active={3}>
                <Timeline.Item
                    bullet={
                        <div className="relative flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="8"
                                height="8"
                                viewBox="0 0 8 8"
                                fill="none"
                            >
                                <circle cx="4" cy="4" r="4" fill="#262626" />
                            </svg>
                            <hr className="absolute right-[-16px] h-[1px] w-[16px] border-black"></hr>
                        </div>
                    }
                    title="first event"
                >
                    This is the first event
                </Timeline.Item>
                <Timeline.Item title="second event">
                    This is the second event
                </Timeline.Item>
                <Timeline.Item title="third event">
                    This is the third event
                </Timeline.Item>
            </Timeline>
        </Modal>
    );
}
