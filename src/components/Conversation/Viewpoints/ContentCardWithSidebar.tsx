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
    const [paragraphReferences, setParagraphReferences] = useState<number[][]>(
        [],
    );

    const viewpointContent = useMemo(() => {
        const parsedReferences = content.replace(
            /\[([^\]]+)]\((\d+)\)/g,
            (_, content, index) =>
                `<span style="color: #15803D">${content} [${Number(index) + 1}]</span>`,
        );

        content.split("\n").forEach((paragraph) => {
            const references: number[] = [];
            const regex = /\[[^\]]+]\((\d+)\)/g;
            let match;

            while ((match = regex.exec(paragraph)) !== null) {
                references.push(Number(match[1])); // Extract the number and convert to a number type
            }
            setParagraphReferences((prev) => [...prev, references]);
        });

        console.log("paragraphReferences", paragraphReferences);
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
                        <FactlistSideBar
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
