import type { FactReference } from "@/types/conversations.types";
import { GlobeAltIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { safeConstructURL } from "@/lib/utils/safeConstructURL";

type ViewpointFactReferenceProps = {
    reference: FactReference;
};

export default function ViewpointFactReference({
    reference,
}: ViewpointFactReferenceProps) {
    const pageURL = safeConstructURL(reference.url);

    return (
        <Link
            href={reference.url}
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
                    alt=""
                />
            ) : (
                <GlobeAltIcon className="inline-block h-3 w-3 rounded-full" />
            )}

            <h1 className="inline-block pl-1 font-sans text-xs font-normal text-neutral-500">
                {pageURL ? pageURL.hostname.replace("www.", "") : reference.url}
            </h1>
        </Link>
    );
}
