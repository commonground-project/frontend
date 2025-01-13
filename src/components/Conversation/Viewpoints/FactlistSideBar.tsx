import type { Fact } from "@/types/conversations.types";

type FactlistSideBarProps = {
    facts: Fact[];
    factIndexes: number[];
    maxHeight: number;
};

export default function FactlistSideBar({
    facts,
    factIndexes,
    maxHeight,
}: FactlistSideBarProps) {
    return (
        <div
            className={`h-auto w-[208px] bg-neutral-100 max-h-[${maxHeight}px] flex flex-col gap-1 rounded-md p-3`}
        >
            {facts.map((fact, index) => (
                <h2
                    className="text-xs text-emerald-700"
                    key={factIndexes[index]}
                >
                    {`[${factIndexes[index]}] ${fact.title}`}
                </h2>
            ))}
        </div>
    );
}
