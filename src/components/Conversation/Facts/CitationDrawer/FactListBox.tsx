"use client";

import {
    useState,
    useContext,
    type Dispatch,
    type SetStateAction,
} from "react";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { Button } from "@mantine/core";
import {
    MagnifyingGlassIcon,
    DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { searchFacts } from "@/lib/requests/facts/searchFacts";
import { ReferenceMarkerContext } from "@/lib/referenceMarker/referenceMarkerContext";
import EditableViewpointReference from "../../Editors/Viewpoints/EditableViewpointReference";
import type { Fact } from "@/types/conversations.types";

type FactListBoxProps = {
    factList: Fact[];
    setFactList: Dispatch<SetStateAction<Fact[]>>;
    searchCallback?: () => void;
};

export default function FactListBox({
    factList,
    setFactList,
    searchCallback,
}: FactListBoxProps) {
    const {
        getCurSelectedFacts,
        addFactToReferenceMarker,
        removeFactFromReferenceMarker,
        removeFactFromAllReferenceMarker,
    } = useContext(ReferenceMarkerContext);

    const removeFact = (factId: string) => {
        // Find the array index of the fact to be removed
        const factIndex = factList.findIndex(
            (fact) => String(fact.id) === factId,
        );
        if (factIndex === -1) {
            throw new Error("Cannot find the selected fact in the list");
        }

        // Remove the fact from the FactList array
        setFactList((prev) =>
            prev.filter((fact) => String(fact.id) !== factId),
        );

        // Update Reference Markers
        removeFactFromAllReferenceMarker(factIndex);
    };

    return (
        <div className="h-full">
            <Button
                variant="filled"
                color="#e5e5e5"
                radius={8}
                className="flex w-full justify-center"
                onClick={() => searchCallback?.()}
            >
                <div className="text-base font-medium text-neutral-800">
                    搜尋 CommonGround
                </div>
                <MagnifyingGlassIcon className="ml-2 size-5 text-neutral-800" />
            </Button>

            {factList.length === 0 ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                    <DocumentMagnifyingGlassIcon className="size-[72px] text-neutral-500" />
                    <div className="text-neutral-500">
                        透過搜尋加入想引註的事實吧
                    </div>
                </div>
            ) : (
                <div className="h-[calc(100%-36px)] overflow-y-auto">
                    <div className="mt-2 flex w-full flex-col gap-2">
                        {factList.map((fact, index) => (
                            <EditableViewpointReference
                                key={fact.id}
                                index={index + 1}
                                fact={fact}
                                removeFact={removeFact}
                                inSelectionMode={true}
                                isSelected={getCurSelectedFacts().includes(
                                    index,
                                )}
                                setIsSelected={(isSelected) => {
                                    if (isSelected) {
                                        addFactToReferenceMarker(index);
                                    } else {
                                        removeFactFromReferenceMarker(index);
                                    }
                                }}
                                linkBarWithBG={false}
                                withBorder={false}
                                showDeleteIcon={true}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
