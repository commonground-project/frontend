"use client";
import { Avatar } from "@mantine/core";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { ViewPoint, Reaction } from "@/types/conversations.types";
import { useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { mockFact, mockFact1 } from "@/mock/conversationMock";
import FactlistSideBar from "@/components/Conversation/Viewpoints/FactlistSideBar";

type IssueCardProps = {
    issueTitle: string;
    viewpoint: ViewPoint;
};

export default function FullViewpointCard({
    issueTitle,
    viewpoint,
}: IssueCardProps) {
    const [reactionStatus, setReactionStatus] = useState<Reaction>(
        viewpoint.userReaction.reaction,
    );
    const [countMap, setCountMap] = useState({
        [Reaction.LIKE]: viewpoint.likeCount,
        [Reaction.REASONABLE]: viewpoint.reasonableCount,
        [Reaction.DISLIKE]: viewpoint.dislikeCount,
    });

    const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
    const [paragraphPositions, setParagraphPositions] = useState<number[]>([]);

    useEffect(() => {
        if (paragraphRefs.current.length > 0) {
            const positions = paragraphRefs.current.map(
                (el) => el?.offsetTop ?? 0,
            );
            setParagraphPositions(positions);
            console.log("paragraph positions", positions);
        }
    }, [paragraphRefs.current]);

    const updateReaction = useMutation({
        mutationKey: ["updateReaction", viewpoint.id],
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
        <div className="relative mb-6 w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            <h2 className="text-lg text-neutral-600">觀點・{issueTitle}</h2>
            <h1 className="mt-1 py-1 font-sans text-2xl font-bold">
                {viewpoint.title}
            </h1>
            <div className="mt-2 flex gap-2">
                <Avatar
                    name={viewpoint.authorName}
                    src={viewpoint.authorAvatar}
                    alt=""
                    size="1.5rem"
                />
                <h1 className="inline-block text-base font-normal text-neutral-600">
                    {viewpoint.authorName}
                </h1>
            </div>
            {viewpoint.content.split("\n").map((paragraph, index) => (
                <p
                    key={index}
                    className="mt-3 text-lg font-normal"
                    ref={(el) => {
                        paragraphRefs.current[index] = el;
                    }}
                >
                    {paragraph}
                </p>
            ))}
            {paragraphPositions.length > 0 &&
                paragraphPositions.map((position, index) => (
                    // <h1
                    //     key={index}
                    //     className={`absolute text-red-500 top-[${position}px] right-[-226px]`}
                    // >
                    //     {index}th paragraph here
                    // </h1>
                    <div
                        className={`absolute top-[${position}px] right-[-226px]`}
                        key={index}
                    >
                        <FactlistSideBar
                            facts={[mockFact, mockFact1]}
                            factIndexes={[1, 2]}
                            maxHeight={500}
                        />
                    </div>
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
