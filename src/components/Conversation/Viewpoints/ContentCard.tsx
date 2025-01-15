"use client";

import { useMemo } from "react";

type ContentCardProps = {
    content: string;
};

export default function ContentCard({ content }: ContentCardProps) {
    const viewpointContent = useMemo(() => {
        const parsedReferences = content.replace(
            /\[([^\]]+)\]\(([^\)]+)\)/g,
            (_, content: string, indexes: string) => {
                return `${content} ${indexes
                    .split(",")
                    .map((num) => Number(num) + 1)
                    .map((num) => `[${num}]`)
                    .join("")}`;
            },
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
