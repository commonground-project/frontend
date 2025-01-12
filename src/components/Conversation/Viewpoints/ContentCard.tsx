"use client";

import { useMemo } from "react";
import type { ViewPoint } from "@/types/conversations.types";
import AuthorProfile from "@/components/Conversation/Shared/AuthorProfile";

type ContentCardProps = {
    viewpoint: ViewPoint;
    textSize?: string;
};

export default function ContentCard({ viewpoint, textSize }: ContentCardProps) {
    const viewpointContent = useMemo(() => {
        const parsedReferences = viewpoint.content.replace(
            /\[\s*\]\((\d+)\)/g,
            (_, num) => ` [${parseInt(num) + 1}]`,
        );
        return parsedReferences.split("\n");
    }, [viewpoint.content]);

    return (
        <div>
            <AuthorProfile
                authorName={viewpoint.authorName}
                authorAvatar={viewpoint.authorAvatar}
                createdAt={viewpoint.createdAt}
            />
            <h1 className="text-lg font-semibold text-neutral-700">
                {viewpoint.title}
            </h1>
            {viewpointContent.map((paragraph, index) => (
                <p
                    key={index}
                    className={`text-${textSize ?? "base"} font-normal text-black`}
                >
                    {paragraph}
                </p>
            ))}
        </div>
    );
}
