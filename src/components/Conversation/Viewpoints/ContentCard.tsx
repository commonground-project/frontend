"use client";
import { useState, useRef, useEffect } from "react";
import { ViewPoint, Reaction } from "@/types/conversations.types";
import { Spoiler, Avatar } from "@mantine/core";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { postReaction } from "@/lib/requests/viewpoints/postReaction";

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

    const [cookie] = useCookies(["auth_token"]);

    const updateReaction = useMutation({
        mutationKey: ["updateReaction", viewpoint.id],
        mutationFn: (reaction: Reaction) =>
            postReaction({
                viewpointId: viewpoint.id,
                reaction,
                auth_token: cookie.auth_token,
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

    const parsedContent = viewpoint.content.replace(
        /\[\s*\]\((\d+)\)/g,
        (_, num) => ` [${num}]`,
    );

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
                    {viewpoint.createdAt.toLocaleDateString()}
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
                    {parsedContent.split("\n")[0]}
                </p>
                {parsedContent
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
