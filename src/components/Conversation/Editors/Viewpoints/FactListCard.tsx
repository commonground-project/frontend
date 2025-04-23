"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { Button } from "@mantine/core";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

import { getPaginatedIssueFactsBySize } from "@/lib/requests/issues/getIssueFacts";
import EditableViewpointReference from "@/components/Conversation/Editors/Viewpoints/EditableViewpointReference";
import FactImportModal from "@/components/Conversation/Facts/FactImportModal";
import { ReferenceMarkerContext } from "@/lib/referenceMarker/referenceMarkerContext";
import withErrorBoundary from "@/lib/utils/withErrorBoundary";

import type { Fact } from "@/types/conversations.types";

type FactListCardProps = {
    issueId: string;
    viewpointTitle: string;
    viewpointFactList: Fact[];
    setViewpointFactList: Dispatch<SetStateAction<Fact[]>>;
    saveContextToLocal: (
        title: string,
        content: string,
        facts: string[],
    ) => void;
};

function FactListCard({
    issueId,
    viewpointTitle,
    viewpointFactList,
    setViewpointFactList,
    saveContextToLocal,
}: FactListCardProps) {
    const {
        inSelectionMode,
        addFactToReferenceMarker,
        removeFactFromReferenceMarker,
        removeFactFromAllReferenceMarker,
        getCurSelectedFacts,
        getInputFieldContent,
    } = useContext(ReferenceMarkerContext);

    const [creationId, setCreationId] = useState<string | null>(null);
    const [cookie] = useCookies(["auth_token"]);

    const autoSave = useMemo(
        () =>
            debounce((title: string, facts: string[]) => {
                saveContextToLocal(title, getInputFieldContent(), facts);
            }, 2000),
        [getInputFieldContent, saveContextToLocal],
    );

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

    // clean up the auto-save function when the component unmounts
    useEffect(() => {
        const autoSaveFunc = autoSave;
        return () => {
            autoSaveFunc.cancel();
        };
    }, [autoSave]);

    // auto save when the viewpoint factlist changes
    useEffect(() => {
        autoSave(
            viewpointTitle,
            viewpointFactList.map((fact) => fact.id),
        );
    }, [viewpointFactList, viewpointTitle, autoSave]);

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
        <div className="h-full">
            <h1 className="mb-6 text-lg font-semibold text-neutral-700">
                相關事實
            </h1>
            <FactImportModal
                importId={creationId}
                setIportId={setCreationId}
                factImportCallback={false}
                viewpointFactList={viewpointFactList}
                addFact={addFact}
                data={data?.pages.flatMap((page) => page.content) ?? []}
            />
            {viewpointFactList.length === 0 ? (
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <MagnifyingGlassIcon className="inline-block size-24 stroke-neutral-500" />
                    <div className="mb-4 mt-2 text-xl font-normal text-neutral-800">
                        目前沒有事實被引入
                    </div>
                    <Button
                        onClick={() => setCreationId(uuidv4())}
                        variant="outline"
                        color="#a1a1a1"
                        leftSection={<PlusIcon className="h-6 w-6" />}
                        classNames={{
                            root: "text-neutral-600 text-[18px]",
                        }}
                    >
                        引入一則事實
                    </Button>
                </div>
            ) : (
                <div className="h-[calc(100vh-170px)] overflow-y-auto">
                    {/* 170px = 56px(header) + 74px(margin-top between header and this div) + 40px(padding-bottom)*/}
                    <div className="flex flex-col justify-start gap-4">
                        {viewpointFactList.map((fact, index) => (
                            <EditableViewpointReference
                                index={index + 1}
                                key={fact.id}
                                fact={fact}
                                removeFact={removeFact}
                                inSelectionMode={inSelectionMode}
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
                            />
                        ))}
                        <Button
                            onClick={() => setCreationId(uuidv4())}
                            radius={"md"}
                            variant="outline"
                            color="#a1a1a1"
                            leftSection={<PlusIcon className="h-6 w-6" />}
                            classNames={{
                                root: "text-black text-base font-normal w-full",
                                inner: "flex justify-start",
                                section: "mr-2",
                            }}
                        >
                            引入一則事實
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withErrorBoundary(FactListCard);
