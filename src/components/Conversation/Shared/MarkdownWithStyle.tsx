import type { Fact } from "@/types/conversations.types";
import React from "react";
import ReactMarkdown from "react-markdown";
import { HoverCard } from "@mantine/core";
import FactCard from "@/components/Conversation/Viewpoints/FactCard";

export default function MarkdownWithCitation({
    content,
    referenceList,
    h1Size = "2xl",
    h2Size = "xl",
    h3Size = "lg",
    textSize = "lg",
}: {
    content: string;
    referenceList: Fact[];
    h1Size?: "lg" | "xl" | "2xl";
    h2Size?: "lg" | "xl" | "2xl";
    h3Size?: "lg" | "xl" | "2xl";
    textSize?: "base" | "lg";
}) {
    return (
        <ReactMarkdown
            components={{
                h1: ({ node: __node, ...props }) => (
                    <h1 className={`text-${h1Size} font-bold`} {...props} />
                ),
                h2: ({ node: __node, ...props }) => {
                    return (
                        <h2
                            className={`text-${h2Size} font-semibold`}
                            {...props}
                        />
                    );
                },
                h3: ({ node: __node, ...props }) => (
                    <h3 className={`text-${h3Size} font-semibold`} {...props} />
                ),
                p: ({ node, ...props }) => {
                    return <p className={`mb-2 text-${textSize}`} {...props} />;
                },
                ul: ({ node: __node, ...props }) => (
                    <ul
                        className={`mb-2 list-disc pl-5 text-${textSize}`}
                        {...props}
                    />
                ),
                li: ({ node: __node, ...props }) => (
                    <li className={`mb-1 text-${textSize}`} {...props} />
                ),
                strong: ({ node: __node, ...props }) => (
                    <strong className={`text-${textSize}`} {...props} />
                ),
                a: ({ node }) => {
                    const factIdxes = node?.properties?.href
                        ?.toString()
                        .split(",");
                    return (
                        <HoverCard>
                            <HoverCard.Target>
                                <span
                                    className="break-all"
                                    onPointerDown={(e) => {
                                        e.stopPropagation();
                                    }}
                                    onPointerUp={(e) => {
                                        e.stopPropagation();
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                >
                                    {node?.children.map((child) => {
                                        if (child.type === "text") {
                                            return child.value;
                                        }
                                    })}
                                    <span className="text-slate-500">
                                        {factIdxes?.map((factIdx) => {
                                            return `[${factIdx}]`;
                                        })}
                                    </span>
                                </span>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <div className="flex flex-col gap-1">
                                    {factIdxes?.map((factIdx) => {
                                        const fact =
                                            referenceList[Number(factIdx)];
                                        if (!fact) return null;
                                        return (
                                            <FactCard
                                                fact={fact}
                                                factIndex={Number(factIdx)}
                                                key={fact.id}
                                            />
                                        );
                                    })}
                                </div>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
