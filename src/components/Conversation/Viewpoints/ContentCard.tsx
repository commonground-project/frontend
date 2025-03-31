"use client";

import { useMemo } from "react";
import { preprocessReferenceContent } from "@/lib/utils/preprocessReferenceContent";
import { Tooltip } from "@mantine/core";

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
                    {paragraph.map((part, index) => {
                        if (
                            part.type === "Reference" ||
                            part.type === "ReferenceCounter"
                        ) {
                            return (
                                <Tooltip
                                    color="transparent"
                                    label={
                                        <div className="size-11 bg-white shadow-xl"></div>
                                    }
                                    inline
                                    key={index}
                                >
                                    <span className="break-all text-green-700">
                                        {part.text}
                                    </span>
                                </Tooltip>
                            );
                        } else
                            return (
                                <span key={index} className="break-all">
                                    {part.text}
                                </span>
                            );
                    })}
                </p>
            ))}
        </>
    );
}
