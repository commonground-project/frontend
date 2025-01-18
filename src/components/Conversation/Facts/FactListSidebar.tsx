import { Dispatch, SetStateAction } from "react";
import type { Fact } from "@/types/conversations.types";
import FactCard from "../Viewpoints/FactCard";

type FactListSideBarProps = {
    sidebarIndex: number;
    setExpandedSidebarIndex: Dispatch<SetStateAction<number | null>>;
    curExpanded: boolean;
    facts: Fact[];
    factIndexes: number[];
    maxHeight: number;
};

export default function FactListSideBar({
    sidebarIndex,
    setExpandedSidebarIndex,
    curExpanded,
    facts,
    factIndexes,
    maxHeight,
}: FactListSideBarProps) {
    if (facts.length === 0 || factIndexes.length === 0) {
        return <></>; // Return nothing if there are no facts
    }

    return (
        <div
            className={`flex h-auto w-[208px] flex-col gap-1 overflow-auto rounded-md bg-neutral-100 p-3 transition-[height]`}
            style={{ maxHeight: `${maxHeight}px` }}
            onClick={() => {
                setExpandedSidebarIndex((prev) =>
                    prev === sidebarIndex ? null : sidebarIndex,
                );
            }}
        >
            {factIndexes.map((factIndex) => {
                const fact = facts[factIndex];

                return !curExpanded ? (
                    <h2
                        className="truncate text-xs text-emerald-700"
                        key={factIndex}
                    >
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
