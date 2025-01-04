"use client";
import { Fact } from "@/types/conversations.types";
import EditableViewpointReference from "@/components/AuthorViewpoint/EditableViewpointReference";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Select, Button } from "@mantine/core";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPaginatedIssueFactsBySize } from "@/lib/requests/issues/getIssueFacts";
import { useCookies } from "react-cookie";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import FactCreationModal from "@/components/Conversation/Facts/FactCreationModal";

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
    const [searchData, setSearchData] = useState<Fact[]>([]); // eslint-disable-line
    const [selectedFactId, setSelectedFactId] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState<string>(""); // eslint-disable-line
    const [creationId, setCreationId] = useState<string | null>(null);

    //remove the fact from the viewpointFactList
    const removeFact = (factId: string) => {
        setViewpointFactList((prev) =>
            prev.filter((fact) => String(fact.id) !== factId),
        );
    };

    //add the selected fact to the viewpointFactList
    const addFact = (factId: string) => {
        //check if the selected fact exists in search data
        const isFactExist = data?.pages
            .map((page) => page.content)
            .flat()
            .some((fact) => fact.id === factId);
        if (!isFactExist) {
            console.error("Selected fact does not exist in search data");
            return;
        }

        //check if the selected fact exists in viewpointFactList
        const isFactExistInList = viewpointFactList.some(
            (fact) => fact.id === factId,
        );
        if (isFactExistInList) {
            console.log("Selected fact already exists in viewpointFactList");
            return;
        }

        //get the selected fact
        const selectedFact = data?.pages
            .map((page) => page.content)
            .flat()
            .find((fact) => fact.id === factId);
        if (!selectedFact) return;

        //add the selected fact to the viewpointFactList
        setViewpointFactList((prev) => [...prev, selectedFact]);
    };

    useEffect(() => {
        if (selectedFactId) {
            addFact(selectedFactId);
            setSelectedFactId(null);
        }
    }, [
        selectedFactId,
        setSelectedFactId,
        viewpointFactList,
        setViewpointFactList,
    ]);

    const [cookie] = useCookies(["auth_token"]);

    const { data, error, status } = useInfiniteQuery({
        queryKey: ["facts", issueId],
        queryFn: ({ pageParam }) =>
            getPaginatedIssueFactsBySize(
                issueId,
                200,
                pageParam,
                cookie.auth_token,
            ),

        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (lastPage.page.number + 1 < lastPage.page.totalPage)
                return lastPage.page.number + 1;
        },
    });

    if (error) {
        toast.error("讀取事實時發生錯誤，請再試一次");
    }

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
                        setSelectedFactId(
                            selectedFactId ? selectedFactId : null,
                        );
                    }}
                    data={data?.pages
                        .map((page) => page.content)
                        .flat()
                        .map((fact) =>
                            //check if searchData already exists in viewpointFactList
                            viewpointFactList.some(
                                (viewpointFact) => viewpointFact.id === fact.id,
                            )
                                ? //if exists, return null. No need to show in the search result
                                  null
                                : {
                                      value: String(fact.id),
                                      label: fact.title,
                                  },
                        )
                        .filter(
                            (item): item is { value: string; label: string } =>
                                item !== null,
                        )}
                    checkIconPosition="right"
                    radius={0}
                    w="100%"
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
                            //TODO: Add onClick event: Open a modal to add a new fact
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
                factCreationCallback={(facts) => addFact(facts[0].id)}
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
                                console.log(
                                    `current reference marker id: ${curReferenceMarkerId}`,
                                );
                                if (isSelected) {
                                    setSelectedFacts((prev) => {
                                        const newMap = new Map(prev);
                                        if (curReferenceMarkerId !== null) {
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
                                        }
                                        return newMap;
                                    });
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
