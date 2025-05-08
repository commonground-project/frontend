import React from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownWithStyle({
    content,
    h1Size = "2xl",
    h2Size = "xl",
    textSize = "lg",
}: {
    content: string;
    h1Size?: "lg" | "xl" | "2xl";
    h2Size?: "lg" | "xl" | "2xl";
    textSize?: "base" | "lg";
}) {
    return (
        <ReactMarkdown
            components={{
                h1: ({ node: __node, ...props }) => (
                    <h1 className={`text-${h1Size} font-bold`} {...props} />
                ),
                h2: ({ node: __node, ...props }) => (
                    <h2 className={`text-${h2Size} font-semibold`} {...props} />
                ),
                p: ({ node: __node, ...props }) => (
                    <p className={`mb-2 text-${textSize}`} {...props} />
                ),
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
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
