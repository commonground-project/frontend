"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { type Fact } from "@/types/conversations.types";
import FactlistSideBar from "../Facts/FactlistSidebar";

type ContentCardWithSidebarProps = {
    facts: Fact[];
    content: string;
};

export default function ContentCardWithSidebar({
    facts,
    content,
}: ContentCardWithSidebarProps) {
    const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
    const [paragraphPositions, setParagraphPositions] = useState<number[]>([]);

    const viewpointContent = useMemo(() => {
        const parsedReferences = content.replace(
            /\[([^\]]+)]\((\d+)\)/g,
            (_, content, index) => `${content} [${Number(index) + 1}]`,
        );
        return parsedReferences.split("\n");
    }, [content]);

    useEffect(() => {
        if (paragraphRefs.current.length > 0) {
            const positions = paragraphRefs.current.map(
                (el) => el?.offsetTop ?? 0,
            );
            setParagraphPositions(positions);
            console.log("paragraph positions", positions);
        }
    }, [paragraphRefs.current]);

    return (
        <div className="relative">
            {viewpointContent.map((paragraph, index) => (
                <p
                    key={index}
                    ref={(el) => {
                        paragraphRefs.current[index] = el;
                    }}
                >
                    {paragraph}
                </p>
            ))}
            {paragraphPositions.length > 0 &&
                paragraphPositions.map((position, index) => (
                    <div
                        style={{
                            position: "absolute",
                            right: "-254px",
                            top: `${position}px`,
                            color: "red",
                        }}
                        key={index}
                    >
                        <FactlistSideBar
                            facts={facts}
                            factIndexes={[1, 2]}
                            maxHeight={500}
                        />
                    </div>
                ))}
        </div>
    );
}
