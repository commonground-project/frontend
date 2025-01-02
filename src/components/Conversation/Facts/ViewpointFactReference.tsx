import type { FactReference } from "@/types/conversations.types";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

type ViewpointFactReferenceProps = {
    reference: FactReference;
};

export default function ViewpointFactReference({
    reference,
}: ViewpointFactReferenceProps) {
    const pageURL = new URL(decodeURIComponent(reference.url));
    const iconURL = pageURL.protocol + "//" + pageURL.hostname + reference.icon;

    return (
        <Link
            href={pageURL.href}
            passHref
            target="_blank"
            rel="noopener noreferrer"
            key={reference.id}
            className="flex items-center"
        >
            {reference.icon.length ? (
                <img
                    className="inline-block h-3 w-3 rounded-full"
                    src={iconURL}
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
