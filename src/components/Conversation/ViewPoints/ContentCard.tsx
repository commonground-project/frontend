"use client";
import { useState, useRef, useEffect } from "react";
import type { ViewPoint } from "@/types/conversations.types";
import { Spoiler } from "@mantine/core";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { Reaction } from "@/types/conversations.types";

type ContentCardProps = {
    viewpoint: ViewPoint;
};

export default function ContentCard({ viewpoint }: ContentCardProps) {
    const [reactionStatus, setReactionStatus] = useState<Reaction>(
        viewpoint.userReaction.reaction,
    );
    const [countMap, setCountMap] = useState({
        [Reaction.LIKE]: viewpoint.likeCount,
        [Reaction.REASONABLE]: viewpoint.reasonableCount,
        [Reaction.DISLIKE]: viewpoint.dislikeCount,
    });
    const [showContentHeight, setShowContentHeight] = useState<number>(0);
    const firstParagraphHeight = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        if (firstParagraphHeight.current) {
            setShowContentHeight(firstParagraphHeight.current.clientHeight);
        }
    }, []);

    const updateReaction = useMutation({
        mutationFn: (reaction: Reaction) => {
            return fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/viewpoint/${viewpoint.id}/reaction/me`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMP_JWT_TOKEN}`,
                    },
                    body: JSON.stringify({
                        reaction: reaction,
                    }),
                },
            );
        },
    });

    const handleReaction = (reaction: Reaction) => {
        if (reaction == Reaction.NONE) return;

        const prevCount = countMap;
        const prevReaction = reactionStatus;
        const newCount = { ...countMap };

        if (reactionStatus === Reaction.NONE) {
            newCount[reaction] += 1;
        } else if (reactionStatus === reaction) {
            newCount[reaction] -= 1;
            reaction = Reaction.NONE;
        } else {
            newCount[reaction] += 1;
            newCount[reactionStatus] -= 1;
        }

        //optimistic update
        setCountMap(() => newCount);
        setReactionStatus((prev) =>
            prev === reaction ? Reaction.NONE : reaction,
        );

        //mutate
        updateReaction.mutate(reaction);
        //mutate error return to previous state
        if (updateReaction.isError) {
            setReactionStatus(() => prevReaction);
            setCountMap(() => prevCount);
        }
    };

    return (
        <div>
            <div className="mb-1 flex">
                <Avatar
                    name={viewpoint.authorName}
                    src={viewpoint.authorAvatar}
                    alt=""
                    size="1rem"
                />
                <h1 className="ml-1.5 inline-block text-xs font-normal text-neutral-600">
                    {viewpoint.authorName}
                </h1>
                <h1 className="ml-3 inline-block text-xs font-normal text-neutral-600">
                    {new Date(viewpoint.createdAt).toLocaleDateString()}
                </h1>
            </div>
            <h1 className="text-lg font-semibold text-neutral-700">
                {viewpoint.title}
            </h1>
            <Spoiler
                maxHeight={showContentHeight}
                showLabel={
                    <span>
                        查看完整觀點
                        <ArrowDownIcon className="inline size-5 fill-none stroke-emerald-600 stroke-[1.5]" />
                    </span>
                }
                hideLabel={
                    <span>
                        顯示較少
                        <ArrowUpIcon className="inline size-5 fill-none stroke-emerald-600 stroke-[1.5]" />
                    </span>
                }
                classNames={{
                    control:
                        "text-emerald-600 text-base font-semibold underline underline-offset-2 decoration-1",
                }}
            >
                <p
                    key={0}
                    ref={firstParagraphHeight}
                    className="text-base font-normal text-black"
                >
                    {viewpoint.content.split("\n")[0]}
                </p>
                {viewpoint.content
                    .split("\n")
                    .slice(1)
                    .map((paragraph, index) => (
                        <p
                            key={index}
                            className="text-base font-normal text-black"
                        >
                            {paragraph}
                        </p>
                    ))}
            </Spoiler>
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
