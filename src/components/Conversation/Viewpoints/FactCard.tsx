import type { Fact } from "@/types/conversations.types";
import ViewpointFactReference from "../Facts/ViewpointFactReference";

type FactCardProps = {
    fact: Fact;
    factIndex: number;
};

export default function FactCard({ fact, factIndex }: FactCardProps) {
    return (
        <div className="flex gap-1">
            <h1 className="text-xs font-normal text-black">
                [{factIndex + 1}]
            </h1>
            <div className="w-[calc(100%-14px)]">
                {/* 100% - 14px, 14px for fact index text*/}
                <h1 className="text-xs font-normal text-black">{fact.title}</h1>
                {fact.references.map((reference) => (
                    <ViewpointFactReference
                        reference={reference}
                        key={reference.id}
                    />
                ))}
            </div>
        </div>
    );
}
