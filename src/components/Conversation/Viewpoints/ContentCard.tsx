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
                    {paragraph.map((part, index) => (
                        <span
                            key={index}
                            className="break-all"
                            style={
                                part.type === "content"
                                    ? undefined
                                    : { color: "#15803D" }
                            }
                        >
                            {part.text}
                        </span>
                    ))}
                </p>
            ))}
        </>
    );
}
