"use client";

import { type ViewPoint } from "@/types/conversations.types";
import Link from "next/link";
import AuthorProfile from "../Shared/AuthorProfile";
import ContentCardWithSidebar from "./ContentCardWithSidebar";
import TernaryReactions from "../Shared/TernaryReactions";
import { postViewpointReaction } from "@/lib/requests/viewpoints/postViewpointReaction";

type PageDisplayCardProps = {
    issueId: string;
    issueTitle: string;
    viewpoint: ViewPoint;
};

export default function PageDisplayCard({
    issueId,
    issueTitle,
    viewpoint,
}: PageDisplayCardProps) {
    return (
        <div className="relative rounded-xl bg-neutral-100 px-7 py-6">
            <Link href={`/issues/${issueId}`}>
                <p className="text-lg text-neutral-600">觀點・{issueTitle}</p>
            </Link>
            <h1 className="mt-1 text-2xl font-semibold">{viewpoint.title}</h1>
            <div className="mt-2">
                <AuthorProfile
                    authorName={viewpoint.authorName}
                    authorAvatar={viewpoint.authorAvatar}
                    createdAt={viewpoint.createdAt}
                />
            </div>
            <div className="my-3 flex flex-col gap-3 text-lg">
                <ContentCardWithSidebar
                    facts={viewpoint.facts}
                    content={viewpoint.content}
                />
            </div>
            <TernaryReactions
                parentTitle={viewpoint.title}
                parentId={viewpoint.id}
                initialReaction={viewpoint.userReaction.reaction}
                initialCounts={{
                    like: viewpoint.likeCount,
                    reasonable: viewpoint.reasonableCount,
                    dislike: viewpoint.dislikeCount,
                }}
                mutationFn={(reaction, auth_token) =>
                    postViewpointReaction({
                        viewpointId: viewpoint.id,
                        auth_token,
                        reaction,
                    })
                }
            />
        </div>
    );
}
