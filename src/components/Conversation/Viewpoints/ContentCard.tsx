"use client";

import { useMemo } from "react";
import { preprocessReferenceContent } from "@/lib/utils/preprocessReferenceContent";

type ContentCardProps = {
    content: string;
};

export default function ContentCard({ content }: ContentCardProps) {
    const viewpointContent = useMemo(() => {
        return preprocessReferenceContent({ content });
    }, [content]);

    return (
        <>
            {viewpointContent.map((paragraph, index) => (
                <p key={index}>
                    {paragraph.map((part, index) =>
                        part.type === "content" ? (
                            <span key={index}>{part.text}</span>
                        ) : (
                            <span key={index} style={{ color: "#15803D" }}>
                                {part.text}
                            </span>
                        ),
                    )}
                </p>
            ))}
        </>
    );
}
