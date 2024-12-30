import { Fact } from "@/types/conversations.types";
import Link from "next/link";

type FactCardProps = {
    fact: Fact;
    factIndex: number;
};

export default function FactCard({ fact, factIndex }: FactCardProps) {
    return (
        <div className="flex">
            <h1 className="inline-block text-xs font-normal text-black">
                [{factIndex + 1}]
            </h1>
            <div className="inline-block px-1">
                <h1 className="text-xs font-normal text-black">{fact.title}</h1>
                {fact.references.map((reference) => (
                    <Link
                        href={decodeURIComponent(reference.url)}
                        passHref
                        target="_blank"
                        rel="noopener noreferrer"
                        key={reference.id}
                        className="flex items-center"
                    >
                        <img
                            className="inline-block h-3 w-3 rounded-full"
                            src={reference.icon}
                            alt=""
                        />
                        <h1 className="inline-block pl-1 font-sans text-xs font-normal text-neutral-500">
                            {decodeURIComponent(reference.url).replace(
                                /(https?:\/\/)?(www\.)?/,
                                "",
                            )}
                        </h1>
                    </Link>
                ))}
            </div>
        </div>
    );
}
