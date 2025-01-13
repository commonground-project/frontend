"use client";
import { useState } from "react";
import { Comment, Reaction } from "@/types/conversations.types";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { Avatar } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";

type CommentCardProps = {
    comment: Comment;
};

export default function CommentCard({ comment }: CommentCardProps) {
    const [reactionStatus, setReactionStatus] = useState<Reaction>(
        comment.userReaction.reaction,
    );
    const [countMap, setCountMap] = useState({
        [Reaction.LIKE]: comment.likeCount,
        [Reaction.REASONABLE]: comment.reasonableCount,
        [Reaction.DISLIKE]: comment.dislikeCount,
    });

    const updateReaction = useMutation({
        mutationKey: ["updateReaction", comment.id],
        mutationFn: (reaction: Reaction) =>
            new Promise<{ reaction: Reaction }>((resolve) => {
                setTimeout(() => {
                    resolve({ reaction });
                }, 100);
            }),

        onMutate(reaction: Reaction) {
            const prevCount = { ...countMap };
            const prevReaction = reactionStatus;

            //optimistic update
            setCountMap((countMap) => {
                const newCount = { ...countMap };

                if (
                    // cancle reaction
                    reaction === Reaction.NONE &&
                    prevReaction !== Reaction.NONE
                ) {
                    newCount[prevReaction] -= 1;
                } else if (
                    // add reaction
                    reaction !== Reaction.NONE &&
                    prevReaction === Reaction.NONE
                ) {
                    newCount[reaction] += 1;
                } else if (
                    // change reaction
                    reaction !== Reaction.NONE &&
                    prevReaction !== Reaction.NONE
                ) {
                    newCount[prevReaction] -= 1;
                    newCount[reaction] += 1;
                }

                return newCount;
            });

            setReactionStatus((prev) => {
                return prev === reaction ? Reaction.NONE : reaction;
            });

            return { prevCount, prevReaction };
        },

        onSuccess(data) {
            setReactionStatus(data.reaction);
            //TODO: update count from server
        },

        onError(__error, __variables, context) {
            if (!context) return;
            setCountMap(context.prevCount);
            setReactionStatus(context.prevReaction);
        },
    });

    const handleReaction = (
        reaction: Reaction.LIKE | Reaction.REASONABLE | Reaction.DISLIKE,
    ) => {
        updateReaction.mutate(
            reaction === reactionStatus ? Reaction.NONE : reaction,
        );
    };

    return (
        <div>
            <div className="mb-1 flex">
                <Avatar
                    name={comment.authorName}
                    src={comment.authorAvatar}
                    alt=""
                    size="1rem"
                />
                <h1 className="ml-1.5 inline-block text-xs font-normal text-neutral-600">
                    {comment.authorName}
                </h1>
                <h1 className="ml-3 inline-block text-xs font-normal text-neutral-600">
                    {comment.createdAt.toLocaleDateString()}
                </h1>
            </div>
            {comment.content.split("\n").map((paragraph, index) => (
                <p key={index} className="text-base font-normal text-black">
                    {paragraph}
                </p>
            ))}
            <div className="flex pt-2">
                {/* like */}
                <button onClick={() => handleReaction(Reaction.LIKE)}>
                    <HandThumbUpIcon
                        className={`size-6 fill-none ${reactionStatus === Reaction.LIKE ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">
                    {countMap[Reaction.LIKE]}
                </h1>
                {/* reasonable */}
                <button onClick={() => handleReaction(Reaction.REASONABLE)}>
                    <ArrowUpCircleIcon
                        className={`size-6 fill-none ${reactionStatus === Reaction.REASONABLE ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">
                    {countMap[Reaction.REASONABLE]}
                </h1>
                {/* dislike */}
                <button onClick={() => handleReaction(Reaction.DISLIKE)}>
                    <HandThumbDownIcon
                        className={`size-6 fill-none ${reactionStatus === Reaction.DISLIKE ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">
                    {countMap[Reaction.DISLIKE]}
                </h1>
            </div>
        </div>
    );
}
