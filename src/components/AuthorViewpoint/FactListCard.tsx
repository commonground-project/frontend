"use client";
import { Fact } from "@/types/conversations.types";
import EditViewpointFact from "@/components/AuthorViewpoint/EditViewpointFact";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Select, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import { allFacts } from "@/mock/conversationMock";

type FactListCardProps = {
    viewpointFactList: Fact[];
    setViewpointFactList: (FactList: Fact[]) => void;
};

export default function FactListCard({
    viewpointFactList,
    setViewpointFactList,
}: FactListCardProps) {
    const [searchData, setSearchData] = useState<Fact[]>(allFacts);
    const [selectedFactId, setSelectedFactId] = useState<string>("");
    const [searchValue, setSearchValue] = useState<string>(""); // eslint-disable-line

    useEffect(() => {
        const selectedFact = searchData.find(
            (fact) => String(fact.id) == selectedFactId,
        );
        if (selectedFact) {
            //move the selected fact to the viewpointFactList
            setViewpointFactList([...viewpointFactList, selectedFact]);

            //remove the selected fact from the searchData
            const newSearchData = searchData.filter(
                (fact) => fact.id !== selectedFact.id,
            );
            setSearchData(newSearchData);
        }
    }, [selectedFactId, setSelectedFactId]);

    const removeFact = (factId: string) => {
        //remove the fact from the viewpointFactList
        const removedFact = viewpointFactList.find(
            (fact) => String(fact.id) == factId,
        );
        const newSelectedFacts = viewpointFactList.filter(
            (fact) => String(fact.id) !== factId,
        );
        setViewpointFactList(newSelectedFacts);

        //add the fact back to the searchData
        const newSearchData = [...searchData, removedFact].filter(
            (fact): fact is Fact => fact !== undefined,
        );
        setSearchData(newSearchData);

        console.log(
            "factlist",
            newSelectedFacts.map((fact) => fact.id),
        );
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
                        setSelectedFactId(selectedFactId ? selectedFactId : "");
                        console.log("User selected id:", selectedFactId);
                    }}
                    data={searchData.map((fact) => ({
                        value: String(fact.id),
                        label: fact.title,
                    }))}
                    checkIconPosition="right"
                    radius={0}
                    w="100%"
                    limit={10}
                    classNames={{
                        input: "ml-2 bg-transparent text-lg font-normal text-neutral-500 focus-within:outline-b-2 focus-within:border-b-emerald-500 focus-within:outline-none",
                    }}
                    placeholder="搜尋 CommonGround"
                    nothingFoundMessage="自行新增事實"
                />
            </div>
            <div className="h-[calc(100vh-265px)] overflow-auto">
                {/* 265px = 56px(header) + 69px(margin-top between header and this div) + 32px(padding-bottom of main)
                + 92px(FactListCard title and search box) + 16px(FactListCard padding-bottom)*/}
                <div className="flex flex-col justify-start gap-3 pl-7 pr-4">
                    {viewpointFactList.map((fact) => (
                        <EditViewpointFact
                            key={fact.id}
                            fact={fact}
                            removeFact={removeFact}
                        />
                    ))}
                    <Button
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
