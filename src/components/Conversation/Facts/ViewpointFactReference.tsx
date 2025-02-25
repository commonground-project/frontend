import type { FactReference } from "@/types/conversations.types";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { safeDecodeURI } from "@/lib/utils/safeDecodeURI";

type ViewpointFactReferenceProps = {
    reference: FactReference;
};

export default function ViewpointFactReference({
    reference,
}: ViewpointFactReferenceProps) {
    const pageURL = new URL(safeDecodeURI(reference.url) ?? "example.com");

    return (
        <Link
            href={pageURL.href}
            passHref
            target="_blank"
            rel="noopener noreferrer"
            key={reference.id}
            className="flex items-center"
            // Prevents the click trigger the blur event of the parent before open the link
            onMouseDown={(e) => {
                console.log("click link");
                e.preventDefault();
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {reference.icon.length ? (
                <img
                    className="inline-block h-3 w-3 rounded-full"
                    src={reference.icon}
                    alt="favicon"
                />
            ) : (
                <GlobeAltIcon className="inline-block h-3 w-3 rounded-full" />
            )}

            <h1 className="inline-block pl-1 font-sans text-xs font-normal text-neutral-500">
                {pageURL.hostname.replace("www.", "")}
            </h1>
        </Link>
    );
}
