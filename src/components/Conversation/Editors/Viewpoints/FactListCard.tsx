"use client";

import { useState, useEffect } from "react";
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
import { set } from "zod";

import type { Fact } from "@/types/conversations.types";

type FactListCardProps = {
    issueId: string;
    viewpointFactList: Fact[];
    setViewpointFactList: Dispatch<SetStateAction<Fact[]>>;
    inSelectionMode: boolean;
    selectedFacts: Map<number, number[]>;
    setSelectedFacts: Dispatch<SetStateAction<Map<number, number[]>>>;
    curReferenceMarkerId: number | null;
    setCurReferenceMarkerId: (value: number | null) => void;
    avaliableMarkerId: number;
};

export default function FactListCard({
    issueId,
    viewpointFactList,
    setViewpointFactList,
    inSelectionMode,
    selectedFacts,
    setSelectedFacts,
    curReferenceMarkerId,
    setCurReferenceMarkerId,
    avaliableMarkerId,
}: FactListCardProps) {
    console.log("current reference marker id: ", curReferenceMarkerId);

    const [searchData, setSearchData] = useState<Fact[]>([]); // eslint-disable-line
    const [selectedFactId, setSelectedFactId] = useState<string | null>(null);
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

    //remove the fact from the viewpointFactList
    const removeFact = (factId: string) => {
        setViewpointFactList((prev) =>
            prev.filter((fact) => String(fact.id) !== factId),
        );
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
            .flat()
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
                            找不到想引著的事實嗎？將其引入 CommonGround 吧!
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
                            isSelected={
                                curReferenceMarkerId === null
                                    ? (selectedFacts
                                          .get(avaliableMarkerId)
                                          ?.includes(index) ?? false)
                                    : (selectedFacts
                                          .get(curReferenceMarkerId)
                                          ?.includes(index) ?? false)
                            }
                            setIsSelected={(isSelected) => {
                                if (isSelected) {
                                    setSelectedFacts((prev) => {
                                        const newMap = new Map(prev);
                                        if (curReferenceMarkerId !== null) {
                                            console.log("has marker id");
                                            return newMap.set(
                                                curReferenceMarkerId,
                                                [
                                                    ...(newMap.get(
                                                        curReferenceMarkerId,
                                                    ) ?? []),
                                                    index,
                                                ],
                                            );
                                        } else {
                                            newMap.set(avaliableMarkerId, [
                                                ...(newMap.get(
                                                    avaliableMarkerId,
                                                ) ?? []),
                                                index,
                                            ]);
                                            console.log(
                                                "no marker id, new id = ",
                                                avaliableMarkerId,
                                            );
                                        }
                                        return newMap;
                                    });
                                    console.log(
                                        "current map: ",
                                        selectedFacts.entries(),
                                    );
                                } else {
                                    setSelectedFacts((prev) => {
                                        const newMap = new Map(prev);
                                        if (curReferenceMarkerId)
                                            newMap.set(curReferenceMarkerId, [
                                                ...(newMap
                                                    .get(curReferenceMarkerId)
                                                    ?.filter(
                                                        (id) =>
                                                            id ===
                                                            curReferenceMarkerId,
                                                    ) ?? []),
                                            ]);
                                        return newMap;
                                    });
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
