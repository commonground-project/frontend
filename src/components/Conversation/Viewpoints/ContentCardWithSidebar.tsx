"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { type Fact } from "@/types/conversations.types";
import FactListSideBar from "../Facts/FactListSidebar";
import { preprocessReferenceContent } from "@/lib/utils/preprocessReferenceContent";
import { getParagraphReferences } from "@/lib/utils/getParagraphReferences";

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
    const [expandedSidebarIndex, setExpandedSidebarIndex] = useState<
        number | null
    >(null);

    const viewpointContent = useMemo(() => {
        const parsedContents = preprocessReferenceContent({ content });
        const allReferences = getParagraphReferences({ content });
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
        <>
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
                            display: `${expandedSidebarIndex === null || expandedSidebarIndex === index ? "" : "none"}`,
                            position: "absolute",
                            right: "-226px",
                            //226 px = 208px width + 18px margin left
                            top: `${position}px`,
                        }}
                        key={index}
                    >
                        <FactListSideBar
                            sidebarIndex={index}
                            setExpandedSidebarIndex={setExpandedSidebarIndex}
                            curExpanded={
                                expandedSidebarIndex === index ? true : false
                            }
                            facts={facts}
                            factIndexes={paragraphReferences[index]}
                            maxHeight={
                                expandedSidebarIndex === index
                                    ? 1000 // arbitrary large number
                                    : (paragraphRefs.current[index]
                                          ?.offsetHeight ?? 0)
                            }
                        />
                    </div>
                ))}
        </>
    );
}
