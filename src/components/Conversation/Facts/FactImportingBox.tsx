import { useState, useMemo, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { useInView } from "react-intersection-observer";
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
    createFactCallback?: () => void;
};

export default function FactImportingBox({
    viewpointFactList,
    addFact,
    addFactCallback, // call when click the add button
    createFactCallback, // call when click the create fact button
}: FactImportingBoxProps) {
    // const [searchData, setSearchData] = useState<Fact[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [debouncedSearchValue, setDebouncedSearchValue] =
        useState<string>("");
    const [addFactBuffer, setAddFactBuffer] = useState<Fact[]>([]);

    const [cookie] = useCookies(["auth_token"]);

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey: ["searchFacts", debouncedSearchValue],
            queryFn: ({ pageParam }) =>
                searchFacts({
                    auth_token: cookie.auth_token,
                    searchValue: searchValue,
                    pageParam,
                    size: 10,
                }),
            initialPageParam: 0,
            getNextPageParam(lastPage) {
                if (lastPage.page.number + 1 < lastPage.page.totalPage)
                    return lastPage.page.number + 1;
            },
            enabled: !!debouncedSearchValue,
        });

    useEffect(() => {
        if (!inView || isFetching) return;
        if (hasNextPage) {
            fetchNextPage();
        }
    }, [inView, isFetching, fetchNextPage, hasNextPage]);

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                setDebouncedSearchValue(value);
            }, 500),
        [debouncedSearchValue],
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
                {data?.pages.map((page, pageIndex, pages) =>
                    page.content.map(
                        (fact, factIndex, facts) =>
                            !viewpointFactList.some(
                                (item) => item.id === fact.id,
                            ) && (
                                <div
                                    key={fact.id}
                                    ref={
                                        pageIndex === pages.length - 1 &&
                                        factIndex === facts.length - 2
                                            ? ref
                                            : undefined
                                    }
                                >
                                    <ImportFactCard
                                        fact={fact}
                                        isSelected={addFactBuffer.includes(
                                            fact,
                                        )}
                                        setIsSelected={(isSelected) => {
                                            if (isSelected) {
                                                setAddFactBuffer((prev) => [
                                                    ...prev,
                                                    fact,
                                                ]);
                                            } else {
                                                setAddFactBuffer((prev) =>
                                                    prev.filter(
                                                        (id) => id !== fact,
                                                    ),
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            ),
                    ),
                )}
            </div>
            {(data === undefined ||
                data.pages.length === 0 ||
                data.pages[0].content.length === 0) &&
                searchValue.length !== 0 && (
                    <div className="flex flex-col items-center justify-center gap-3">
                        <DocumentMinusIcon className="size-[72px] text-neutral-500" />
                        <div className="text-neutral-500">找不到相關事實</div>
                    </div>
                )}
            <div className="flex w-full justify-end">
                {/* search result is empty and is not fetching */}
                {((data === undefined ||
                    data.pages.length === 0 ||
                    data.pages[0].content.length === 0) &&
                    searchValue.length !== 0 &&
                    !isFetching &&
                    !isFetchingNextPage && (
                        <Button
                            onClick={() => {
                                createFactCallback?.();
                            }}
                            variant="filled"
                        >
                            <PlusIcon className="mr-2 size-4 text-white" />
                            引入新的事實
                        </Button>
                    )) || (
                    // search result is not empty
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
