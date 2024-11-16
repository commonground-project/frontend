import { Fact } from "@/types/conversations.types";
import Link from "next/link";

type FactCardProps = {
    fact: Fact;
};

export default function FactCard({ fact }: FactCardProps) {
    return (
        <div className="">
            <h1 className="text-lg font-normal text-black">{fact.title}</h1>
            {/* sources */}

            {fact.references.map((reference) => (
                <div key={reference.id} className="mt-1">
                    <Link
                        href={reference.url}
                        passHref
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-200 px-3"
                    >
                        <img className="h-4 w-4" src={reference.icon} alt="" />
                        <h1 className="text-sm font-normal text-neutral-500">
                            {reference.url.replace(
                                /(https?:\/\/)?(www\.)?/,
                                "",
                            )}
                        </h1>
                        <h1 className="text-sm font-normal text-neutral-500">
                            {reference.title}
                        </h1>
                    </Link>
                </div>
            ))}
        </div>
    );
}
