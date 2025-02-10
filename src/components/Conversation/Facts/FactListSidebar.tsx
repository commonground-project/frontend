"use client";
import { type Dispatch, type SetStateAction, useRef, useEffect } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import type { Fact } from "@/types/conversations.types";
import FactCard from "../Viewpoints/FactCard";
import { ActionIcon } from "@mantine/core";

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
    const cardRef = useRef<HTMLDivElement>(null);

    if (facts.length === 0 || factIndexes.length === 0) {
        return <></>; // Return nothing if there are no facts
    }

    // Self-hoisting useEffect to handle click outside (onBlur)
    // to prevent the sidebar from closing when clicking on the urls inside the sidebar
    useEffect(() => {
        if (!cardRef.current) return;

        function handleClickOutside(event: MouseEvent) {
            if (
                cardRef.current &&
                !cardRef.current.contains(event.target as Node)
            ) {
                console.log("blur");
                setExpandedSidebarIndex((prev) =>
                    prev === sidebarIndex ? null : prev,
                );
            }
        }

        if (curExpanded) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }

        return () => document.removeEventListener("click", handleClickOutside);
    }, [curExpanded, cardRef]);

    return (
        <div
            ref={cardRef}
            tabIndex={0}
            className={`flex h-auto w-[208px] flex-col justify-center rounded-md bg-neutral-100 p-3 transition-[height]`}
            style={{ maxHeight: `${maxHeight}px` }}
            onClick={() => {
                console.log("click card");
                setExpandedSidebarIndex((prev) =>
                    prev === sidebarIndex ? null : sidebarIndex,
                );
            }}
        >
            {!curExpanded ? (
                maxHeight === 28 ? (
                    <div className="flex justify-center gap-2 text-emerald-700">
                        <h2 className="text-xs">展開所有引註</h2>
                        <ChevronUpDownIcon className="h-4 w-4" />
                    </div>
                ) : (
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
                )
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
        </div>
    );
}
