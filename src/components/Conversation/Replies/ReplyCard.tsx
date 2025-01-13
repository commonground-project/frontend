"use client";

import { type Reply } from "@/types/conversations.types";
import AuthorProfile from "../Shared/AuthorProfile";
import TernaryReactions from "../Shared/TernaryReactions";
import { mock } from "@/lib/requests/mock";
import type { LegacyRef } from "react";

type ReplyCardProps = {
    reply: Reply;
    ref: LegacyRef<HTMLDivElement>;
};

export default function ReplyCard({ reply, ref }: ReplyCardProps) {
    return (
        <div ref={ref}>
            <AuthorProfile
                authorName={reply.authorName}
                authorAvatar={reply.authorAvatar}
                createdAt={reply.createdAt}
            />
            <p className="my-2">{reply.content}</p>
            <TernaryReactions
                parentId={reply.id}
                initialReaction={reply.userReaction.reaction}
                initialCounts={{
                    like: reply.likeCount,
                    reasonable: reply.reasonableCount,
                    dislike: reply.dislikeCount,
                }}
                mutationFn={mock}
            />
        </div>
    );
}
