"use client";

import { getPaginatedIssueFactsById } from "@/lib/requests/issues/getIssueFacts";
import { useInfiniteQuery } from "@tanstack/react-query";
import ReferenceBar from "./ReferenceBar";
import { useEffect, useState } from "react";
import FactModal from "./FactCreationModal";
import { Button } from "@mantine/core";
import { PlusIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import FactSkeleton from "./FactSkeleton";
import { useCookies } from "react-cookie";
import { useInView } from "react-intersection-observer";
import withErrorBoundary from "@/components/AppShell/WithErrorBoundary";

interface AllFactsDisplayProps {
    issueId: string;
}

export function AllFactsDisplay({ issueId }: AllFactsDisplayProps) {
    const [creationId, setCreationId] = useState<string | null>(null);
    const [cookies] = useCookies(["auth_token"]);

    const factQuery = useInfiniteQuery({
        queryKey: ["facts", issueId],
        queryFn: ({ pageParam }) =>
            getPaginatedIssueFactsById(issueId, pageParam, cookies.auth_token),
        initialPageParam: 0,
        getNextPageParam(lastPage, __allPages, lastPageParam) {
            return lastPageParam === lastPage.page.totalPage
                ? undefined
                : lastPageParam + 1;
        },
    });

    const { ref, inView } = useInView({
        threshold: 0.5,
    });

    useEffect(() => {
        if (!inView || factQuery.isFetching) return;
        factQuery.fetchNextPage();
    }, [inView, factQuery]);

    return (
        <div className="mt-3">
            <h2 className="mb-1 text-lg font-semibold text-black">所有事實</h2>
            <div className="flex flex-col gap-2">
                {factQuery.isLoading && (
                    <>
                        <FactSkeleton />
                        <FactSkeleton references={2} />
                        <FactSkeleton />
                    </>
                )}
                {factQuery.data &&
                    factQuery.data.pages.map((page, pageIndex, pages) =>
                        page.content.map((fact, factIndex, facts) => (
                            <div
                                key={fact.id}
                                className="mb-2"
                                ref={
                                    pageIndex === pages.length - 1 &&
                                    factIndex === facts.length - 2
                                        ? ref
                                        : undefined
                                }
                            >
                                <p className="mb-2 text-lg text-black">
                                    {fact.title}
                                </p>
                                <div className="space-y-1">
                                    {fact.references.map((reference) => (
                                        <ReferenceBar
                                            key={reference.id}
                                            showSrcTitle={true}
                                            reference={reference}
                                        />
                                    ))}
                                </div>
                            </div>
                        )),
                    )}
            </div>
            <FactModal
                issueId={issueId}
                creationID={creationId}
                setCreationID={setCreationId}
            />

            <Button
                onClick={() => {
                    setCreationId(uuidv4());
                }}
                leftSection={<PlusIcon className="h-5 w-5" />}
                variant="transparent"
                color="black"
                size="compact-md"
                classNames={{
                    root: "px-0 hover:bg-neutral-100",
                    inner: "justify-start",
                    label: "font-sans font-bold text-md",
                }}
            >
                新增事實
            </Button>
        </div>
    );
}

export default withErrorBoundary(AllFactsDisplay);
