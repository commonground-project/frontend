"use client";
import { useState, useRef, useEffect } from "react";
import { ViewPoint } from "@/types/conversations.types";
import { Spoiler } from "@mantine/core";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@mantine/core";

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
    const [showContentHeight, setShowContentHeight] = useState<number>(0);
    const firstParagraphHeight = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        if (firstParagraphHeight.current) {
            setShowContentHeight(firstParagraphHeight.current.clientHeight);
        }
    }, []);

    const handleReaction = (reaction: ReactionStatus) => {
        setReactionStatus((prev) =>
            prev === reaction ? ReactionStatus.null : reaction,
        );
    };

    return (
        <div>
            <div className="mb-1 flex">
                <Avatar
                    name={viewpoint.user.username}
                    src={viewpoint.user.avatar}
                    alt=""
                    size="1rem"
                />
                <h1 className="ml-1.5 inline-block text-xs font-normal text-neutral-600">
                    {viewpoint.user.username}
                </h1>
                <h1 className="ml-3 inline-block text-xs font-normal text-neutral-600">
                    {viewpoint.created.toLocaleDateString()}
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
