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
        console.log("original content", content);

        const regex = /\[([^\]]+)\]\(([^\)]+)\)/g;
        const parsedContents: {
            type: "content" | "reference";
            text: string;
        }[][] = [];
        const allReferences: number[][] = [];

        content.split("\n").map((paragraph) => {
            let lastIndex = 0;
            let match;
            const result: { type: "content" | "reference"; text: string }[] =
                [];
            const references: number[] = [];

            while ((match = regex.exec(paragraph)) !== null) {
                // Push normal text before the reference
                if (lastIndex < match.index) {
                    result.push({
                        type: "content",
                        text: paragraph.slice(lastIndex, match.index),
                    });
                }
                // Push the reference text and record the reference
                let referenceText = match[1];
                match[2].split(",").map((num) => {
                    referenceText = referenceText + `[${Number(num) + 1}]`;
                    if (
                        references.find((ref) => ref === Number(num)) ===
                        undefined
                    )
                        references.push(Number(num));
                });
                result.push({ type: "reference", text: referenceText });

                // Update the lastIndex to the end of the current match
                lastIndex = regex.lastIndex;
            }
            console.log("references: ", references);
            allReferences.push(references);

            // Push remaining text after the last reference
            if (lastIndex < paragraph.length) {
                result.push({
                    type: "content",
                    text: paragraph.slice(lastIndex),
                });
            }
            parsedContents.push(result);
        });

        console.log("parsedContents", parsedContents);
        console.log("allReferences", allReferences);

        return { parsedContents, allReferences };
    }, [content]);

    useEffect(() => {
        setParagraphReferences(viewpointContent.allReferences);
    }, [viewpointContent.allReferences]);

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
            {viewpointContent.parsedContents.map((paragraph, index) => (
                <p
                    key={index}
                    ref={(el) => {
                        paragraphRefs.current[index] = el;
                    }}
                >
                    {paragraph.map((part, index) =>
                        part.type === "content" ? (
                            <span key={index}>{part.text}</span>
                        ) : (
                            <span key={index} style={{ color: "#15803D" }}>
                                {part.text}
                            </span>
                        ),
                    )}
                </p>
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
