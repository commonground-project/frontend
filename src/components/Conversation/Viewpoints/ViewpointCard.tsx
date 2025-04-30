import type { Reaction, ViewPoint } from "@/types/conversations.types";
import ContentCard from "../Shared/ContentCard";
import TernaryReactions from "@/components/Conversation/Shared/TernaryReactions";
import { postViewpointReaction } from "@/lib/requests/viewpoints/postViewpointReaction";
import AuthorProfile from "../Shared/AuthorProfile";
import {
    ArrowRightIcon,
    ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

type ViewpointCardProps = {
    issueId: string;
    viewpoint: ViewPoint;
};

export default function ViewpointCard({
    issueId,
    viewpoint,
}: ViewpointCardProps) {
    return (
        <Link href={`/issues/${issueId}/viewpoints/${viewpoint.id}`}>
            <AuthorProfile
                authorName={viewpoint.authorName}
                authorAvatar={viewpoint.authorAvatar}
                createdAt={viewpoint.createdAt}
            />
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
            <div className="flex justify-start align-bottom md:justify-between">
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
                <div className="flex gap-1">
                    <ChatBubbleOvalLeftIcon className="size-6 text-neutral-600 md:hidden" />
                    <div className="text-neutral-600">
                        {viewpoint.replyCount}
                    </div>
                </div>
                <div className="hidden flex-shrink-0 items-center gap-1 text-emerald-600 md:flex">
                    <p>查看完整觀點</p>
                    <ArrowRightIcon className="w-4" />
                </div>
            </div>
        </Link>
    );
}
