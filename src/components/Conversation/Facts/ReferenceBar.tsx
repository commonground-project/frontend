import type { FactReference } from "@/types/conversations.types";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

type FactBarProps = {
    reference: FactReference;
    showSrcTitle?: boolean;
};

export default function ReferenceBar({
    reference,
    showSrcTitle,
}: FactBarProps) {
    const pageURL = new URL(decodeURIComponent(reference.url));

    return (
        <Link
            key={reference.id}
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 items-center gap-2 rounded-full bg-neutral-200 px-3 py-1 hover:bg-gray-200"
        >
            {reference.icon.length ? (
                <img
                    className="h-4 w-4 rounded-full"
                    src={reference.icon}
                    alt="favicon"
                />
            ) : (
                <GlobeAltIcon className="h-4 w-4 text-gray-600" />
            )}

            <span className="font-sans text-sm font-normal text-neutral-500">
                {pageURL.hostname.replace("www.", "")}
            </span>
            {showSrcTitle && (
                <span className="truncate text-sm text-gray-600">
                    {reference.title}
                </span>
            )}
        </Link>
    );
}
