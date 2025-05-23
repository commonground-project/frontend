import type { FactReference } from "@/types/conversations.types";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import { Loader } from "@mantine/core";
import Link from "next/link";
import { safeConstructURL } from "@/lib/utils/safeConstructURL";

type FactBarProps = {
    reference: FactReference;
    showSrcTitle?: boolean;
    isLoading?: boolean;
    withBackground?: boolean;
};

export default function ReferenceBar({
    reference,
    showSrcTitle,
    isLoading,
    withBackground = true,
}: FactBarProps) {
    const pageURL = safeConstructURL(reference.url);

    return (
        <Link
            key={reference.id}
            href={reference.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-w-0 max-w-full flex-shrink-0 items-center gap-2 ${withBackground ? "rounded-full bg-neutral-200 px-3 py-1 hover:bg-gray-200" : ""} `}
        >
            {isLoading ? (
                <Loader size="xs" />
            ) : reference.icon.length ? (
                <img
                    className="h-4 w-4 rounded-full"
                    src={reference.icon}
                    alt=""
                />
            ) : (
                <GlobeAltIcon className="h-4 w-4 text-gray-600" />
            )}

            <span className="font-sans text-sm font-normal text-neutral-500">
                {pageURL ? pageURL.hostname.replace("www.", "") : reference.url}
            </span>
            {showSrcTitle && (
                <span className="truncate text-sm text-gray-600">
                    {reference.title}
                </span>
            )}
        </Link>
    );
}
