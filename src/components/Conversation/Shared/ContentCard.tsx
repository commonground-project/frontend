"use client";

import { useMemo } from "react";
import { type Fact } from "@/types/conversations.types";
import { preprocessReferenceContent } from "@/lib/utils/preprocessReferenceContent";
import { HoverCard } from "@mantine/core";
import FactCard from "@/components/Conversation/Viewpoints/FactCard";

type ContentCardProps = {
    facts: Fact[];
    content: string;
};

export default function ContentCard({ facts, content }: ContentCardProps) {
    const viewpointContent = useMemo(() => {
        return preprocessReferenceContent({ content });
    }, [content]);

    return (
        <>
            {viewpointContent.map((paragraph, index) => (
                <p key={index}>
                    {paragraph.map((part, index) => {
                        if (part.type === "Reference") {
                            return (
                                <HoverCard
                                    shadow="xl"
                                    key={index}
                                    classNames={{
                                        dropdown: "border-0 bg-white max-w-56",
                                    }}
                                    middlewares={{ inline: true }}
                                >
                                    <HoverCard.Target>
                                        <span className="break-all text-green-700">
                                            {part.text}
                                            {/* put the reference counter together */}
                                            {paragraph[index + 1]?.type ===
                                                "ReferenceCounter" &&
                                                paragraph[index + 1].text}
                                        </span>
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        <div className="flex flex-col gap-1">
                                            {part.references?.map((factidx) => {
                                                const fact = facts[factidx];
                                                if (!fact) return null;
                                                return (
                                                    <FactCard
                                                        fact={fact}
                                                        factIndex={factidx}
                                                        key={fact.id}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </HoverCard.Dropdown>
                                </HoverCard>
                            );
                        } else if (part.type === "Content") {
                            return (
                                <span key={index} className="break-all">
                                    {part.text}
                                </span>
                            );
                        }
                    })}
                </p>
            ))}
        </>
    );
}
