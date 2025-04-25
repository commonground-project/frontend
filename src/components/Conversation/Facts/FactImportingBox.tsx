import { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { debounce } from "lodash";
import { Button, Input } from "@mantine/core";
import {
    MagnifyingGlassIcon,
    PlusIcon,
    DocumentMinusIcon,
} from "@heroicons/react/24/outline";

import { searchFacts } from "@/lib/requests/facts/searchFacts";
import ImportFactCard from "./ImportFactCard";
import type { Fact } from "@/types/conversations.types";

type FactImportingBoxProps = {
    viewpointFactList: Fact[];
    addFact: (factId: Fact) => void;
    addFactCallback?: () => void;
};

export default function FactImportingBox({
    viewpointFactList,
    addFact,
    addFactCallback,
}: FactImportingBoxProps) {
    const [searchData, setSearchData] = useState<Fact[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [addFactBuffer, setAddFactBuffer] = useState<Fact[]>([]);

    const [cookie] = useCookies(["auth_token"]);

    const { mutate: search } = useMutation({
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

    return (
        <div className="flex w-full flex-col gap-4">
            <Input
                variant="unstyled"
                rightSection={
                    <MagnifyingGlassIcon className="inline-block h-5 w-5 stroke-neutral-500" />
                }
                value={searchValue}
                width={"100%"}
                onChange={(e) => {
                    setSearchValue(e.target.value);
                    debouncedSearch(e.target.value);
                }}
                radius={0}
                classNames={{
                    input: "bg-transparent text-lg font-normal text-neutral-500 focus-within:outline-b-2 focus-within:border-b-emerald-500 focus-within:outline-none",
                }}
                placeholder="透過搜尋加入想引註的事實"
            />
            <div className="flex max-h-[300px] flex-col gap-4 overflow-y-auto">
                {searchData.map(
                    (fact) =>
                        !viewpointFactList.some(
                            (item) => item.id === fact.id,
                        ) && (
                            <ImportFactCard
                                key={fact.id}
                                fact={fact}
                                isSelected={addFactBuffer.includes(fact)}
                                setIsSelected={(isSelected) => {
                                    if (isSelected) {
                                        setAddFactBuffer((prev) => [
                                            ...prev,
                                            fact,
                                        ]);
                                    } else {
                                        setAddFactBuffer((prev) =>
                                            prev.filter((id) => id !== fact),
                                        );
                                    }
                                }}
                            />
                        ),
                )}
            </div>
            {searchData.length === 0 && searchValue.length !== 0 && (
                <div className="flex flex-col items-center justify-center gap-3">
                    <DocumentMinusIcon className="size-[72px] text-neutral-500" />
                    <div className="text-neutral-500">找不到相關事實</div>
                </div>
            )}
            <div className="flex w-full justify-end">
                {(searchData.length === 0 && searchValue.length !== 0 && (
                    <Button onClick={() => {}} variant="filled">
                        <PlusIcon className="mr-2 size-4 text-white" />
                        引入新的事實
                    </Button>
                )) || (
                    <Button
                        onClick={() => {
                            addFactBuffer.forEach((factId) => {
                                addFact(factId);
                            });
                            setAddFactBuffer([]);
                            addFactCallback?.();
                        }}
                        variant="filled"
                        disabled={addFactBuffer.length === 0}
                    >
                        <PlusIcon className="mr-2 size-4 text-white" />
                        加入
                    </Button>
                )}
            </div>
        </div>
    );
}
