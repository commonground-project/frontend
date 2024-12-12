import { Fact } from "@/types/conversations.types";
import Link from "next/link";

type AllFactsCardProps = {
    facts: Fact[];
};

export default function AllFactsCard({ facts }: AllFactsCardProps) {
    return (
        <>
            {facts.map((fact) => (
                <div key={fact.id} className="mb-2">
                    <p className="mb-2 text-lg text-black">{fact.title}</p>
                    <div className="space-y-1">
                        {fact.references.map((reference) => (
                            <Link
                                key={reference.id}
                                href={reference.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 rounded-full bg-gray-200/50 p-[0.3%] hover:bg-gray-200"
                            >
                                <img
                                    className="ml-2 h-3 w-3 rounded-full"
                                    src={reference.icon}
                                    alt=""
                                />
                                <div className="flex items-center gap-x-2">
                                    <span className="font-sans text-xs font-normal text-neutral-500">
                                        {new URL(
                                            reference.url,
                                        ).hostname.replace("www.", "")}
                                    </span>
                                    <span className="max-w-[38rem] truncate text-sm text-gray-600">
                                        {reference.title}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </>
    );
}
