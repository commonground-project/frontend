"use client";

import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import type { Reaction, ViewPoint } from "@/types/conversations.types";
import ContentCard from "../Shared/ContentCard";
import TernaryReactions from "@/components/Conversation/Shared/TernaryReactions";
import { postViewpointReaction } from "@/lib/requests/viewpoints/postViewpointReaction";
import { readViewpoint } from "@/lib/requests/viewpoints/readViewpoints";
import AuthorProfile from "../Shared/AuthorProfile";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type ViewpointCardProps = {
    issueId: string;
    viewpoint: ViewPoint;
};

export default function ViewpointCard({
    issueId,
    viewpoint,
}: ViewpointCardProps) {
    const [cookies] = useCookies(["auth_token"]);

    const readViewpointMutation = useMutation({
        mutationKey: ["readViewpoint"],
        mutationFn: () =>
            readViewpoint({
                viewpointId: viewpoint.id,
                auth_token: cookies.auth_token,
            }),
    });

    return (
        <Link
            href={`/issues/${issueId}/viewpoints/${viewpoint.id}`}
            onClick={() => {
                readViewpointMutation.mutate();
            }}
        >
            <div className="flex items-center gap-3">
                <AuthorProfile
                    authorName={viewpoint.authorName}
                    authorAvatar={viewpoint.authorAvatar}
                    createdAt={viewpoint.createdAt}
                />
                {!viewpoint.readStatus && (
                    <div className="h-4 w-10 rounded-full bg-emerald-500 text-center text-[10px] text-white">
                        New
                    </div>
                )}
            </div>
            <h1 className="text-lg font-semibold text-neutral-700">
                {viewpoint.title}
            </h1>
            <div className="mb-2 mt-1 flex flex-col gap-3">
                <ContentCard
                    contentType="觀點"
                    content={viewpoint.content}
                    facts={viewpoint.facts}
                    truncate={true}
                />
            </div>
            <div className="flex align-bottom md:justify-between">
                <div className="w-3/4 md:w-auto">
                    <TernaryReactions
                        parentTitle={viewpoint.title}
                        parentId={viewpoint.id}
                        initialReaction={viewpoint.userReaction.reaction}
                        initialCounts={{
                            like: viewpoint.likeCount,
                            reasonable: viewpoint.reasonableCount,
                            dislike: viewpoint.dislikeCount,
                        }}
                        mutationFn={(reaction: Reaction, auth_token: string) =>
                            postViewpointReaction({
                                viewpointId: viewpoint.id,
                                reaction,
                                auth_token,
                            })
                        }
                    />
                </div>
                <div className="flex w-1/4 gap-1 md:hidden">
                    <ChatBubbleOvalLeftIcon className="size-6 text-neutral-600" />
                    <div className="text-neutral-600">
                        {/* {viewpoint.replyCount} */}0
                    </div>
                </div>
            </div>
        </Link>
    );
}
