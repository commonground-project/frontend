"use client";

import { useState, useEffect, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { Select, Button } from "@mantine/core";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

import { getPaginatedIssueFactsBySize } from "@/lib/requests/issues/getIssueFacts";
import EditableViewpointReference from "@/components/Conversation/Editors/Viewpoints/EditableViewpointReference";
import FactCreationModal from "@/components/Conversation/Facts/FactCreationModal";
import { ReferenceMarkerContext } from "@/components/ReferenceMarker/ReferenceMarkerProvider";

import type { Fact } from "@/types/conversations.types";

type FactListCardProps = {
    issueId: string;
    viewpointFactList: Fact[];
    setViewpointFactList: Dispatch<SetStateAction<Fact[]>>;
};

export default function FactListCard({
    issueId,
    viewpointFactList,
    setViewpointFactList,
}: FactListCardProps) {
    const {
        inSelectionMode,
        addFactToReferenceMarker,
        removeFactFromReferenceMarker,
        removeFactFromAllReferenceMarker,
        getCurSelectedFacts,
    } = useContext(ReferenceMarkerContext);

    const [searchData, setSearchData] = useState<Fact[]>([]); // eslint-disable-line
    const [searchValue, setSearchValue] = useState<string>(""); // eslint-disable-line
    const [creationId, setCreationId] = useState<string | null>(null);
    const [cookie] = useCookies(["auth_token"]);

    const { data, error } = useInfiniteQuery({
        queryKey: ["facts", issueId],
        queryFn: ({ pageParam }) =>
            getPaginatedIssueFactsBySize(
                issueId,
                pageParam,
                cookie.auth_token,
                200,
            ),

        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.page.number + 1 < lastPage.page.totalPage)
                return lastPage.page.number + 1;
        },
    });

    useEffect(() => {
        if (!error) return;
        toast.error("無法獲取事實列表，請重新整理頁面");
    }, [error]);

    // Remove the fact from the viewpointFactList
    const removeFact = (factId: string) => {
        // Find the array index of the fact to be removed
        const factIndex = viewpointFactList.findIndex(
            (fact) => String(fact.id) === factId,
        );
        if (factIndex === -1) {
            throw new Error("Cannot find the selected fact in the list");
        }

        // Remove the fact from the FactList array
        setViewpointFactList((prev) =>
            prev.filter((fact) => String(fact.id) !== factId),
        );

        // Update Reference Markers
        removeFactFromAllReferenceMarker(factIndex);
    };

    //add the selected fact to the viewpointFactList
    const addFact = (factId: string) => {
        // Check if the selected fact exists in viewpointFactList
        const factInViewpointFactList = viewpointFactList.some(
            (fact) => fact.id === factId,
        );
        if (factInViewpointFactList) {
            throw new Error(
                "Selected fact already exists in viewpointFactList",
            );
        }

        const selectedFact = data?.pages
            .flatMap((page) => page.content)
            .find((fact) => fact.id === factId);
        if (!selectedFact) {
            throw new Error("Cannot select the selected fact");
        }

        setViewpointFactList((prev) => [...prev, selectedFact]);
    };

    return (
        <div className="h-full rounded-lg bg-neutral-100 px-7 py-4">
            <h1 className="mb-1 text-lg font-semibold text-neutral-700">
                事實
            </h1>
            <div className="flex w-full items-center py-1 pr-[52px]">
                <MagnifyingGlassIcon className="inline-block h-5 w-5 stroke-neutral-500" />
                <Select
                    variant="unstyled"
                    searchable
                    value={searchValue}
                    onChange={(selectedFactId) => {
                        if (!selectedFactId) return;
                        addFact(selectedFactId);
                    }}
                    data={data?.pages
                        .flatMap((page) => page.content)
                        .filter(
                            (fact) =>
                                !viewpointFactList.some(
                                    (viewpointFact) =>
                                        viewpointFact.id === fact.id,
                                ),
                        )
                        .map((fact) => ({
                            value: String(fact.id),
                            label: fact.title,
                        }))}
                    checkIconPosition="right"
                    radius={0}
                    classNames={{
                        input: "ml-2 bg-transparent text-lg font-normal text-neutral-500 focus-within:outline-b-2 focus-within:border-b-emerald-500 focus-within:outline-none",
                    }}
                    placeholder="搜尋 CommonGround"
                    nothingFoundMessage={
                        <Button
                            onClick={() => setCreationId(uuidv4())}
                            variant="transparent"
                            classNames={{
                                root: "max-w-full h-auto px-0 text-neutral-600 text-base font-normal hover:text-emerald-500 duration-300",
                                inner: "flex justify-start",
                                label: "whitespace-normal text-left",
                            }}
                        >
                            找不到想引註的事實嗎？將其引入 CommonGround 吧!
                        </Button>
                    }
                />
            </div>
            <FactCreationModal
                issueId={issueId}
                creationID={creationId}
                setCreationID={setCreationId}
                factCreationCallback={(facts) =>
                    facts.forEach((fact) => addFact(fact.id))
                }
            />
            <div className="h-[calc(100vh-265px)] overflow-auto">
                {/* 265px = 56px(header) + 69px(margin-top between header and this div) + 32px(padding-bottom of main)
                + 92px(FactListCard title and search box) + 16px(FactListCard padding-bottom)*/}
                <div className="flex flex-col justify-start gap-3 pl-7 pr-4">
                    {viewpointFactList.map((fact, index) => (
                        <EditableViewpointReference
                            key={fact.id}
                            fact={fact}
                            removeFact={removeFact}
                            inSelectionMode={inSelectionMode}
                            isSelected={getCurSelectedFacts().includes(index)}
                            setIsSelected={(isSelected) => {
                                if (isSelected) {
                                    addFactToReferenceMarker(index);
                                } else {
                                    removeFactFromReferenceMarker(index);
                                }
                            }}
                        />
                    ))}
                    <Button
                        onClick={() => setCreationId(uuidv4())}
                        variant="transparent"
                        leftSection={<PlusIcon className="h-6 w-6" />}
                        classNames={{
                            root: "px-0 text-neutral-600 text-base font-normal hover:text-emerald-500 duration-300",
                            inner: "flex justify-start",
                            section: "mr-2",
                        }}
                    >
                        引入一條事實
                    </Button>
                </div>
            </div>
        </div>
    );
}
