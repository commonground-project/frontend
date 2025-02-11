"use client";

import { useState, useRef } from "react";
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
    const [currentReaction, setCurrentReaction] =
        useState<Reaction>(initialReaction);
    const pendingReaction = useRef<Reaction | null>(null);

    const [cookie] = useCookies(["auth_token"]);
    const baseReactionCount = {
        like: initialCounts.like - (initialReaction === Reaction.LIKE ? 1 : 0),
        reasonable:
            initialCounts.reasonable -
            (initialReaction === Reaction.REASONABLE ? 1 : 0),
        dislike:
            initialCounts.dislike -
            (initialReaction === Reaction.DISLIKE ? 1 : 0),
    };

    const updateReaction = useMutation({
        mutationKey: ["updateReaction", parentId],
        mutationFn: (reaction: Reaction) =>
            mutationFn(reaction, cookie.auth_token),
        onMutate: async (newReaction) => {
            pendingReaction.current = newReaction;

            // Optimistically update UI
            setCurrentReaction(newReaction);

            // Save the previous reaction before making changes
            return currentReaction;
        },
        onSuccess: (data) => {
            if (pendingReaction.current === data.reaction) {
                setCurrentReaction(data.reaction);
                pendingReaction.current = null;
            }
        },
        onError: (__err, __variables, context) => {
            // Revert to previous reaction on failure
            // Rollback to the previous state
            if (context !== undefined) {
                setCurrentReaction(context);
            }
            pendingReaction.current = null;
        },
    });

    const handleReaction = (
        reaction: Reaction.LIKE | Reaction.REASONABLE | Reaction.DISLIKE,
    ) => {
        updateReaction.mutate(
            reaction === currentReaction ? Reaction.NONE : reaction,
        );
    };

    return (
        <div className="flex">
            {/* like */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    handleReaction(Reaction.LIKE);
                }}
            >
                <HandThumbUpIcon
                    style={{
                        width: size ? size * 4 : 24,
                        height: size ? size * 4 : 24,
                    }}
                    className={`fill-none ${currentReaction === Reaction.LIKE ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                />
            </button>
            <h1 className="w-11 px-1 text-neutral-600">
                {baseReactionCount.like +
                    (currentReaction === Reaction.LIKE ? 1 : 0)}
            </h1>
            {/* reasonable */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    handleReaction(Reaction.REASONABLE);
                }}
            >
                <ArrowUpCircleIcon
                    style={{
                        width: size ? size * 4 : 24,
                        height: size ? size * 4 : 24,
                    }}
                    className={`fill-none ${currentReaction === Reaction.REASONABLE ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                />
            </button>
            <h1 className="w-11 px-1 text-neutral-600">
                {baseReactionCount.reasonable +
                    (currentReaction === Reaction.REASONABLE ? 1 : 0)}
            </h1>
            {/* dislike */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    handleReaction(Reaction.DISLIKE);
                }}
            >
                <HandThumbDownIcon
                    style={{
                        width: size ? size * 4 : 24,
                        height: size ? size * 4 : 24,
                    }}
                    className={`fill-none ${currentReaction === Reaction.DISLIKE ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                />
            </button>
            <h1 className="w-11 px-1 text-neutral-600">
                {baseReactionCount.dislike +
                    (currentReaction === Reaction.DISLIKE ? 1 : 0)}
            </h1>
        </div>
    );
}
