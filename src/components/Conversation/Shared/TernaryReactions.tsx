"use client";

import { useState } from "react";
import { Reaction } from "@/types/conversations.types";
import { useCookies } from "react-cookie";
import { useMutation } from "@tanstack/react-query";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";

type UpdateTernaryActionResponse = {
    reaction: Reaction;
};

type TernaryReactionsProps = {
    parentId: string;
    initialReaction: Reaction;
    initialCounts: {
        like: number;
        reasonable: number;
        dislike: number;
    };
    mutationFn: (
        reaction: Reaction,
        auth_token: string,
    ) => Promise<UpdateTernaryActionResponse>;
    size?: number;
};

export default function TernaryReactions({
    parentId,
    initialReaction,
    initialCounts,
    mutationFn,
    size,
}: TernaryReactionsProps) {
    const [reactionStatus, setReactionStatus] =
        useState<Reaction>(initialReaction);
    const [countMap, setCountMap] = useState({
        [Reaction.LIKE]: initialCounts.like,
        [Reaction.REASONABLE]: initialCounts.reasonable,
        [Reaction.DISLIKE]: initialCounts.dislike,
    });

    const [cookie] = useCookies(["auth_token"]);

    const updateReaction = useMutation({
        mutationKey: ["updateReaction", parentId],
        mutationFn: (reaction: Reaction) =>
            mutationFn(reaction, cookie.auth_token),
        onMutate(reaction: Reaction) {
            const prevCount = { ...countMap };
            const prevReaction = reactionStatus;

            //optimistic update
            setCountMap((countMap) => {
                const newCount = { ...countMap };

                if (
                    // cancel reaction
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
        <div className="flex">
            {/* like */}
            <button onClick={() => handleReaction(Reaction.LIKE)}>
                <HandThumbUpIcon
                    style={{
                        width: size ? size * 4 : 24,
                        height: size ? size * 4 : 24,
                    }}
                    className={`fill-none ${reactionStatus === Reaction.LIKE ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                />
            </button>
            <h1 className="w-11 px-1 text-neutral-600">
                {countMap[Reaction.LIKE]}
            </h1>
            {/* reasonable */}
            <button onClick={() => handleReaction(Reaction.REASONABLE)}>
                <ArrowUpCircleIcon
                    style={{
                        width: size ? size * 4 : 24,
                        height: size ? size * 4 : 24,
                    }}
                    className={`fill-none ${reactionStatus === Reaction.REASONABLE ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                />
            </button>
            <h1 className="w-11 px-1 text-neutral-600">
                {countMap[Reaction.REASONABLE]}
            </h1>
            {/* dislike */}
            <button onClick={() => handleReaction(Reaction.DISLIKE)}>
                <HandThumbDownIcon
                    style={{
                        width: size ? size * 4 : 24,
                        height: size ? size * 4 : 24,
                    }}
                    className={`fill-none ${reactionStatus === Reaction.DISLIKE ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                />
            </button>
            <h1 className="w-11 px-1 text-neutral-600">
                {countMap[Reaction.DISLIKE]}
            </h1>
        </div>
    );
}
