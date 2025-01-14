"use client";

import { useMemo, useState, useRef, useEffect, useLayoutEffect } from "react";

type ContentCardWithSidebarProps = {
    content: string;
};

export default function ContentCardWithSidebar({
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
                    <h1
                        key={index}
                        style={{
                            position: "absolute",
                            right: "-226px",
                            top: `${position}px`,
                            color: "red",
                        }}
                    >
                        {index}th paragraph here
                    </h1>
                    // <div
                    //     className={`absolute top-[${position}px] right-[-226px]`}
                    //     key={index}
                    // >
                    //     <FactlistSideBar
                    //         facts={[mockFact, mockFact1]}
                    //         factIndexes={[1, 2]}
                    //         maxHeight={500}
                    //     />
                    // </div>
                ))}
        </div>
    );
}
