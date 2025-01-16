"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { type Fact } from "@/types/conversations.types";
import FactListSideBar from "../Facts/FactListSidebar";

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
    const [paragraphReferences, setParagraphReferences] = useState<number[][]>(
        [],
    );

    const viewpointContent = useMemo(() => {
        const parsedReferences = content.replace(
            /\[([^\]]+)\]\(([^\)]+)\)/g,
            (_, content: string, indexes: string) => {
                return `<span style="color: #15803D">${content} ${indexes
                    .split(",")
                    .map((num) => Number(num) + 1)
                    .map((num) => `[${num}]`)
                    .join("")}</span>`;
            },
        );

        content.split("\n").forEach((paragraph) => {
            const references: number[] = [];
            const regex = /\[([^\]]+)\]\(([^\)]+)\)/g;
            let match;

            while ((match = regex.exec(paragraph)) !== null) {
                match[2].split(",").map((num) => references.push(Number(num)));
            }
            setParagraphReferences((prev) => [...prev, references]);
        });

        return parsedReferences.split("\n");
    }, []);

    useEffect(() => {
        if (paragraphRefs.current.length > 0) {
            const positions = paragraphRefs.current.map(
                (el) => el?.offsetTop ?? 0,
            );
            setParagraphPositions(positions);
        }
    }, []);

    return (
        <div className="relative">
            {viewpointContent.map((paragraph, index) => (
                <p
                    key={index}
                    ref={(el) => {
                        paragraphRefs.current[index] = el;
                    }}
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                />
            ))}
            {paragraphPositions.length > 0 &&
                paragraphPositions.map((position, index) => (
                    <div
                        style={{
                            position: "absolute",
                            right: "-254px",
                            top: `${position}px`,
                        }}
                        key={index}
                    >
                        <FactListSideBar
                            facts={facts}
                            factIndexes={paragraphReferences[index]}
                            maxHeight={
                                paragraphRefs.current[index]?.offsetHeight ?? 0
                            }
                        />
                    </div>
                ))}
        </div>
    );
}
