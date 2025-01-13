"use client";

import { mockReply } from "@/mock/conversationMock";
import ReplyCard from "./ReplyCard";
import { Fragment } from "react";

type ReplyListProps = {
    viewpointId: string;
};

export default function ReplyList({ viewpointId }: ReplyListProps) {
    const data = [mockReply];

    return (
        <div className="rounded-xl bg-white px-7 py-6">
            <h1 className="mb-2 text-xl font-semibold">查看所有回覆</h1>
            <div className="mt-2 flex flex-col gap-3">
                {data.map((reply, i, arr) => (
                    <Fragment key={i}>
                        <ReplyCard reply={reply} />
                        {i !== arr.length - 1 && (
                            <hr className="w-full border-t border-neutral-700" />
                        )}
                    </Fragment>
                ))}
            </div>
        </div>
    );
}
