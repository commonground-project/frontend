"use client";

import { useState, useMemo, useContext, Dispatch, SetStateAction } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { debounce } from "lodash";
import { Input } from "@mantine/core";
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
};

export default function FactListBox({
    factList,
    setFactList,
}: FactListBoxProps) {
    const {
        getCurSelectedFacts,
        addFactToReferenceMarker,
        removeFactFromReferenceMarker,
        removeFactFromAllReferenceMarker,
    } = useContext(ReferenceMarkerContext);

    const [searchData, setSearchData] = useState<Fact[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");

    const [cookie] = useCookies(["auth_token"]);

    const { mutate: search, status: searchStatus } = useMutation({
        mutationKey: ["searchFacts"],
        mutationFn: (value: string) =>
            searchFacts({
                auth_token: cookie.auth_token,
                searchValue: value,
            }),
        onSuccess(data) {
            setSearchData(data);
        },
    });

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                search(value);
            }, 500),
        [search],
    );

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
        <>
            <div className="flex w-full justify-center rounded-lg bg-neutral-200">
                <Input
                    variant="unstyled"
                    rightSection={
                        <MagnifyingGlassIcon className="inline-block size-5 stroke-neutral-500" />
                    }
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                        debouncedSearch(e.target.value);
                    }}
                    radius={0}
                    classNames={{
                        input: "bg-transparent text-lg font-medium text-neutral-500 focus-within:outline-none",
                    }}
                    placeholder="搜尋 CommonGround"
                />
            </div>

            {factList.length === 0 ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                    <DocumentMagnifyingGlassIcon className="size-[72px] text-neutral-500" />
                    <div className="text-neutral-500">
                        透過搜尋加入想引註的事實吧
                    </div>
                </div>
            ) : (
                <div className="mt-2 flex w-full flex-col gap-2">
                    {factList.map((fact, index) => (
                        <EditableViewpointReference
                            key={fact.id}
                            index={index + 1}
                            fact={fact}
                            removeFact={removeFact}
                            inSelectionMode={true}
                            isSelected={getCurSelectedFacts().includes(index)}
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
            )}
        </>
    );
}
