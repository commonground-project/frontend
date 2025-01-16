import { useState } from "react";
import type { Fact } from "@/types/conversations.types";
import FactCard from "../Viewpoints/FactCard";

type FactListSideBarProps = {
    facts: Fact[];
    factIndexes: number[];
    maxHeight: number;
};

export default function FactListSideBar({
    facts,
    factIndexes,
    maxHeight,
}: FactListSideBarProps) {
    const [expanded, setExpanded] = useState(false);

    if (facts.length === 0 || factIndexes.length === 0) {
        return <></>; // Return nothing if there are no facts
    }

    return (
        <div
            className={`flex h-auto w-[208px] flex-col gap-1 overflow-auto rounded-md bg-neutral-100 p-3`}
            style={{ maxHeight: `${maxHeight}px` }}
            onClick={() => setExpanded((prev) => !prev)}
        >
            {factIndexes.map((factIndex) => {
                const fact = facts[factIndex];

                return !expanded ? (
                    <h2 className="text-xs text-emerald-700" key={factIndex}>
                        {`[${factIndex + 1}] ${fact.title}`}
                    </h2>
                ) : (
                    <FactCard
                        fact={fact}
                        factIndex={factIndex}
                        key={factIndex}
                    />
                );
            })}
        </div>
    );
}
