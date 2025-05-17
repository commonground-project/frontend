"use client";

import { useMemo, useState } from "react";
import { type Fact } from "@/types/conversations.types";
import {
    preprocessReferenceContent,
    type TypedContentFragment,
} from "@/lib/utils/preprocessReferenceContent";
import { HoverCard, Drawer } from "@mantine/core";
import FactCard from "@/components/Conversation/Viewpoints/FactCard";
import EditableViewpointReference from "@/components/Conversation/Editors/Viewpoints/EditableViewpointReference";
import ImportFactCard from "../Facts/ImportFactCard";

type ContentCardProps = {
    facts: Fact[];
    content: string;
    contentType?: "觀點" | "回覆";
    truncate?: boolean;
};

export default function ContentCard({
    facts,
    content,
    contentType,
    truncate = false,
}: ContentCardProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [parsedContent, referencedContent] = useMemo(() => {
        const parsedContent = preprocessReferenceContent({ content });

        const referencedContent: TypedContentFragment[] = [];
        let text = "";
        parsedContent.map((paragraph) => {
            paragraph.map((part) => {
                if (part.type === "Reference") {
                    text += part.text;
                }
                if (part.type === "ReferenceCounter") {
                    text += part.text;
                    referencedContent.push({
                        type: "Reference",
                        text: text,
                        references: part.references,
                    });
                    text = "";
                }
            });
        });
        return [parsedContent, referencedContent];
    }, [content]);

    return (
        <>
            {parsedContent.map(
                (paragraph, index) =>
                    (truncate && index > 0) || (
                        <p key={index}>
                            {paragraph.map((part, index) => {
                                if (part.type === "Reference") {
                                    return (
                                        <HoverCard
                                            shadow="xl"
                                            key={index}
                                            classNames={{
                                                dropdown:
                                                    "border-0 bg-white max-w-56",
                                            }}
                                            middlewares={{ inline: true }}
                                        >
                                            <HoverCard.Target>
                                                <span
                                                    className="break-all text-green-700"
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
                                                    {part.text}
                                                    {/* put the reference counter together */}
                                                    {paragraph[index + 1]
                                                        ?.type ===
                                                        "ReferenceCounter" &&
                                                        paragraph[index + 1]
                                                            .text}
                                                </span>
                                            </HoverCard.Target>
                                            <HoverCard.Dropdown>
                                                <div className="flex flex-col gap-1">
                                                    {part.references?.map(
                                                        (factidx) => {
                                                            const fact =
                                                                facts[factidx];
                                                            if (!fact)
                                                                return null;
                                                            return (
                                                                <FactCard
                                                                    fact={fact}
                                                                    factIndex={
                                                                        factidx
                                                                    }
                                                                    key={
                                                                        fact.id
                                                                    }
                                                                />
                                                            );
                                                        },
                                                    )}
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
                            {index === 0 && truncate && (
                                <span className="text-base font-bold">
                                    ...顯示所有
                                </span>
                            )}
                        </p>
                    ),
            )}
            <Drawer
                opened={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                overlayProps={{
                    onClick: (e) => e.stopPropagation(), // Prevent triggering onClick on the parent element
                    onPointerDown: (e) => e.stopPropagation(),
                }}
                title={`${contentType ?? ""}引註資料`}
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
                    {referencedContent.map((part, index) => {
                        return (
                            <div key={index} className="flex flex-col gap-2">
                                <div className="text-base font-medium text-emerald-700">
                                    {part.text}
                                </div>
                                {part.references?.map((factidx) => {
                                    const fact = facts[factidx];
                                    if (!fact) return null;
                                    return (
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
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </Drawer>
        </>
    );
}
