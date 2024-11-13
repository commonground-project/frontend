"use client";
import { useState } from "react";
import { ViewPoint } from "@/types/conversations.types";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import Avatar from "../Avatar/Avatar";

type ContentCardProps = {
    viewpoint: ViewPoint;
};

enum ReactionStatus {
    like = "like",
    dislike = "dislike",
    reasonable = "reasonable",
    null = "null",
}

export default function ContentCard({ viewpoint }: ContentCardProps) {
    const [reactionStatus, setReactionStatus] = useState<ReactionStatus>(
        ReactionStatus.null,
    );
    const [showFullContent, setShowFullContent] = useState<boolean>(false);

    let content = viewpoint.content;

    if (!showFullContent) {
        content = viewpoint.content.split("\n")[0];
    }

    const handleReaction = (reaction: ReactionStatus) => {
        setReactionStatus((prev) =>
            prev === reaction ? ReactionStatus.null : reaction,
        );
    };

    return (
        <div>
            <div className="mb-1 flex">
                <div className="inline">
                    <Avatar user={viewpoint.user} />
                </div>
                <h1 className="ml-3 inline-block text-xs font-normal text-neutral-600">
                    {viewpoint.created.toLocaleDateString()}
                </h1>
            </div>
            <h1 className="text-lg font-semibold text-neutral-700">
                {viewpoint.title}
            </h1>
            <p className="text-base font-normal text-black">
                {content}
                <button
                    className="pl-2 text-base font-semibold text-emerald-600 underline"
                    onClick={() => setShowFullContent((prev) => !prev)}
                >
                    {showFullContent ? "顯示較少" : "查看完整觀點"}
                    <ArrowDownIcon className="inline size-5 fill-none stroke-emerald-600 stroke-[1.5]" />
                </button>
            </p>
            <div className="mt-2 flex">
                {/* like */}
                <button onClick={() => handleReaction(ReactionStatus.like)}>
                    <HandThumbUpIcon
                        className={`size-6 fill-none ${reactionStatus === ReactionStatus.like ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">
                    {viewpoint.like +
                        (reactionStatus === ReactionStatus.like ? 1 : 0)}
                </h1>
                {/* reasonable */}
                <button
                    onClick={() => handleReaction(ReactionStatus.reasonable)}
                >
                    <ArrowUpCircleIcon
                        className={`size-6 fill-none ${reactionStatus === ReactionStatus.reasonable ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">
                    {viewpoint.reasonable +
                        (reactionStatus === ReactionStatus.reasonable ? 1 : 0)}
                </h1>
                {/* dislike */}
                <button onClick={() => handleReaction(ReactionStatus.dislike)}>
                    <HandThumbDownIcon
                        className={`size-6 fill-none ${reactionStatus === ReactionStatus.dislike ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">
                    {viewpoint.dislike +
                        (reactionStatus === ReactionStatus.dislike ? 1 : 0)}
                </h1>
            </div>
        </div>
    );
}
