"use client";

import { useMutation } from "@tanstack/react-query";
import { type Reply } from "@/types/conversations.types";
import AuthorProfile from "../Shared/AuthorProfile";
import TernaryReactions from "../Shared/TernaryReactions";
import { postReplyReaction } from "@/lib/requests/replies/postReplyReaction";
import { useEffect, type Ref } from "react";
import { useCookies } from "react-cookie";
import ContentCard from "@/components/Conversation/Shared/ContentCard";
import { useInView } from "react-intersection-observer";
import { readReply } from "@/lib/requests/replies/readReply";

type ReplyCardProps = {
    reply: Reply;
    ref: Ref<HTMLDivElement>;
};

export default function ReplyCard({ reply, ref }: ReplyCardProps) {
    const { ref: inViewRef, inView } = useInView();
    const [cookies] = useCookies(["auth_token"]);

    const { mutate: readReplyMutation } = useMutation({
        mutationKey: ["readReply"],
        mutationFn: () =>
            readReply({ replyId: reply.id, auth_token: cookies.auth_token }),
    });

    useEffect(() => {
        if (inView && cookies.auth_token) {
            readReplyMutation();
        }
    }, [inView, readReplyMutation, cookies.auth_token]);

    return (
        <div ref={ref}>
            <div className="flex items-center gap-3" ref={inViewRef}>
                <AuthorProfile
                    authorName={reply.authorName}
                    authorAvatar={reply.authorAvatar}
                    createdAt={reply.createdAt}
                />
                {!reply.readStatus && (
                    <div className="h-4 w-10 rounded-full bg-emerald-500 text-center text-[10px] text-white">
                        New
                    </div>
                )}
            </div>
            <ContentCard content={reply.content} facts={reply.facts} />
            <TernaryReactions
                parentTitle={reply.content}
                parentId={reply.id}
                initialReaction={reply.userReaction.reaction}
                initialCounts={{
                    like: reply.likeCount,
                    reasonable: reply.reasonableCount,
                    dislike: reply.dislikeCount,
                }}
                mutationFn={(reaction, auth_token) =>
                    postReplyReaction(reply.id, reaction, auth_token)
                }
            />
        </div>
    );
}
