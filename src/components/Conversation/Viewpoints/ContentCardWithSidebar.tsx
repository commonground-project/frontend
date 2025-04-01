"use client";

import { useMemo } from "react";
import { type Fact } from "@/types/conversations.types";
import { preprocessReferenceContent } from "@/lib/utils/preprocessReferenceContent";
import { HoverCard, Tooltip } from "@mantine/core";
import FactCard from "@/components/Conversation/Viewpoints/FactCard";

type ContentCardWithSidebarProps = {
    facts: Fact[];
    content: string;
};

export default function ContentCardWithSidebar({
    facts,
    content,
}: ContentCardWithSidebarProps) {
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
                                // <Tooltip
                                //     color="transparent"
                                //     label={
                                //         <div className="bg-white shadow-xl">
                                //             {part.references?.map((factidx) => {
                                //                 const fact = facts[factidx];
                                //                 if (!fact) return null;
                                //                 return (
                                //                     <FactCard
                                //                         fact={fact}
                                //                         factIndex={factidx}
                                //                         key={fact.id}
                                //                     />
                                //                 );
                                //             })}
                                //         </div>
                                //     }
                                //     inline
                                //     key={index}
                                // >
                                //     <span className="break-all text-green-700">
                                //         {part.text}
                                //     </span>
                                // </Tooltip>
                                <HoverCard
                                    shadow="xl"
                                    key={index}
                                    classNames={{
                                        dropdown: "border-0 bg-white",
                                    }}
                                >
                                    <HoverCard.Target>
                                        <span className="break-all text-green-700">
                                            {part.text}
                                        </span>
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
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
                                    </HoverCard.Dropdown>
                                </HoverCard>
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
