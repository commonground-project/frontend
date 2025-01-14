"use client";

import { useMemo } from "react";

type ContentCardProps = {
    content: string;
};

export default function ContentCard({ content }: ContentCardProps) {
    const viewpointContent = useMemo(() => {
        const parsedReferences = content.replace(
            /\[([^\]]+)]\((\d+)\)/g,
            (_, content, index) => `${content} [${Number(index) + 1}]`,
        );
        return parsedReferences.split("\n");
    }, [content]);

    return (
        <>
            {viewpointContent.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </>
    );
}
