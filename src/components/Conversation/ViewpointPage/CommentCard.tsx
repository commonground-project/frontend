"use client";
import { useState } from "react";
import { Comment } from "@/types/conversations.types";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { Avatar } from "@mantine/core";

type CommentCardProps = {
    comment: Comment;
};

enum ReactionStatus {
    like = "like",
    dislike = "dislike",
    reasonable = "reasonable",
    null = "null",
}

export default function CommentCard({ comment }: CommentCardProps) {
    const [reactionStatus, setReactionStatus] = useState<ReactionStatus>(
        ReactionStatus.null,
    );

    const handleReaction = (reaction: ReactionStatus) => {
        setReactionStatus((prev) =>
            prev === reaction ? ReactionStatus.null : reaction,
        );
    };

    return (
        <div>
            <div className="mb-1 flex">
                <Avatar
                    name={comment.user.nickname}
                    src={comment.user.avatar}
                    alt=""
                    size="1rem"
                />
                <h1 className="ml-1.5 inline-block text-xs font-normal text-neutral-600">
                    {comment.user.nickname}
                </h1>
                <h1 className="ml-3 inline-block text-xs font-normal text-neutral-600">
                    {comment.created.toLocaleDateString()}
                </h1>
            </div>
            {comment.content.split("\n").map((paragraph, index) => (
                <p key={index} className="text-base font-normal text-black">
                    {paragraph}
                </p>
            ))}
            <div className="flex pt-2">
                {/* like */}
                <button onClick={() => handleReaction(ReactionStatus.like)}>
                    <HandThumbUpIcon
                        className={`size-6 fill-none ${reactionStatus === ReactionStatus.like ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">
                    {comment.like +
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
                    {comment.reasonable +
                        (reactionStatus === ReactionStatus.reasonable ? 1 : 0)}
                </h1>
                {/* dislike */}
                <button onClick={() => handleReaction(ReactionStatus.dislike)}>
                    <HandThumbDownIcon
                        className={`size-6 fill-none ${reactionStatus === ReactionStatus.dislike ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">
                    {comment.dislike +
                        (reactionStatus === ReactionStatus.dislike ? 1 : 0)}
                </h1>
            </div>
        </div>
    );
}
