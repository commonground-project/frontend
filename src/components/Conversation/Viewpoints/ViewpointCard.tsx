import type { Reaction, ViewPoint } from "@/types/conversations.types";
import ContentCard from "../Shared/ContentCard";
import TernaryReactions from "@/components/Conversation/Shared/TernaryReactions";
import { postViewpointReaction } from "@/lib/requests/viewpoints/postViewpointReaction";
import AuthorProfile from "../Shared/AuthorProfile";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import { Chip } from "@mantine/core";
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
            <div className="flex">
                <AuthorProfile
                    authorName={viewpoint.authorName}
                    authorAvatar={viewpoint.authorAvatar}
                    createdAt={viewpoint.createdAt}
                />
                <Chip variant="filled">New</Chip>
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
