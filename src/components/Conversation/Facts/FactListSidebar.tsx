import type { Dispatch, SetStateAction } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";
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
            tabIndex={0}
            className={`flex h-auto w-[208px] flex-col justify-center rounded-md bg-neutral-100 p-3 transition-[height]`}
            style={{ maxHeight: `${maxHeight}px` }}
            onClick={() => {
                setExpandedSidebarIndex((prev) =>
                    prev === sidebarIndex ? null : sidebarIndex,
                );
            }}
            onBlur={() => {
                console.log("blur");
                setExpandedSidebarIndex((prev) =>
                    prev === sidebarIndex ? null : prev,
                );
            }}
        >
            {!curExpanded ? (
                <div className="flex flex-col gap-1 overflow-hidden">
                    {factIndexes.map((factIndex) => {
                        const fact = facts[factIndex];
                        return (
                            <h2
                                className="truncate text-xs text-emerald-700"
                                key={factIndex}
                            >
                                {`[${factIndex + 1}] ${fact.title}`}
                            </h2>
                        );
                    })}
                </div>
            ) : (
                factIndexes.map((factIndex) => {
                    const fact = facts[factIndex];
                    return (
                        <FactCard
                            fact={fact}
                            factIndex={factIndex}
                            key={factIndex}
                        />
                    );
                })
            )}
            {!curExpanded ? (
                <div className="flex justify-center">
                    <EllipsisHorizontalIcon className="size-4 text-emerald-700" />
                </div>
            ) : null}
        </div>
    );
}
