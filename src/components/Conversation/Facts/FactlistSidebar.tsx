import { useState } from "react";
import type { Fact } from "@/types/conversations.types";
import FactCard from "../Viewpoints/FactCard";

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
    const [expended, setExpended] = useState(false);

    return (
        <div
            className={`h-auto w-[208px] bg-neutral-100 max-h-[${maxHeight}px] flex flex-col gap-1 rounded-md p-3`}
            onClick={() => setExpended((prev) => !prev)}
        >
            {facts.map((fact, index) =>
                !expended ? (
                    <h2
                        className="text-xs text-emerald-700"
                        key={factIndexes[index]}
                    >
                        {`[${factIndexes[index] + 1}] ${fact.title}`}
                    </h2>
                ) : (
                    <FactCard
                        fact={fact}
                        factIndex={factIndexes[index]}
                        key={factIndexes[index]}
                    />
                ),
            )}
        </div>
    );
}
