import React from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownWithStyle({ content }: { content: string }) {
    return (
        <ReactMarkdown
            components={{
                h1: ({ node: __node, ...props }) => (
                    <h1 className="text-2xl font-bold" {...props} />
                ),
                h2: ({ node: __node, ...props }) => (
                    <h2 className="text-xl font-semibold" {...props} />
                ),
                p: ({ node: __node, ...props }) => (
                    <p className="mb-2 text-lg" {...props} />
                ),
                ul: ({ node: __node, ...props }) => (
                    <ul className="mb-2 list-disc pl-5 text-lg" {...props} />
                ),
                li: ({ node: __node, ...props }) => (
                    <li className="mb-1 text-lg" {...props} />
                ),
                strong: ({ node: __node, ...props }) => (
                    <strong className="text-lg" {...props} />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}
