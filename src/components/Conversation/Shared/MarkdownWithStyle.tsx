import type { Fact } from "@/types/conversations.types";
import React from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { HoverCard, Drawer } from "@mantine/core";
import FactCard from "@/components/Conversation/Viewpoints/FactCard";
import EditableViewpointReference from "@/components/Conversation/Editors/Viewpoints/EditableViewpointReference";

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
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
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
                        <h3
                            className={`text-${h3Size} font-semibold`}
                            {...props}
                        />
                    ),
                    p: ({ node: __node, ...props }) => {
                        return (
                            <p className={`mb-2 text-${textSize}`} {...props} />
                        );
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
                                            setIsDrawerOpen(true);
                                        }}
                                    >
                                        {node?.children.map((child) => {
                                            if (child.type === "text") {
                                                return child.value;
                                            }
                                        })}
                                        <span className="text-slate-500">
                                            {factIdxes?.map((factIdx) => {
                                                return `[${Number(factIdx) + 1}]`;
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
            <Drawer
                opened={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                overlayProps={{
                    onClick: (e) => e.stopPropagation(), // Prevent triggering onClick on the parent element
                    onPointerDown: (e) => e.stopPropagation(),
                }}
                title="事件簡述引註資料"
                padding="lg"
                withCloseButton={false}
                position="bottom"
                className="block md:hidden"
                classNames={{
                    content: " rounded-t-xl",
                }}
                onClick={(e) => e.stopPropagation()} // Prevent triggering onClick on the parent element
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col gap-4">
                    {referenceList.map((fact, index) => (
                        <EditableViewpointReference
                            index={index + 1}
                            fact={fact}
                            removeFact={() => {}}
                            inSelectionMode={false}
                            isSelected={false}
                            setIsSelected={() => {}}
                            withBorder={false}
                            linkBarWithBG={false}
                            showDeleteIcon={false}
                            withHover={false}
                            key={index}
                        />
                    ))}
                </div>
            </Drawer>
        </>
    );
}
