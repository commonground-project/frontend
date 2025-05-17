"use client";

import { useEffect, useState, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import { v4 as uuidv4 } from "uuid";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { Modal, Select, Button } from "@mantine/core";
import { toast } from "sonner";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { getPaginatedFacts } from "@/lib/requests/facts/getFacts";
import { ReferenceMarkerContext } from "@/lib/referenceMarker/referenceMarkerContext";
import EditableReplyReference from "@/components/Conversation/Editors/Replies/EditableReplyReference";
import FactCreationModal from "@/components/Conversation/Facts/FactCreationModal";

import type { Fact } from "@/types/conversations.types";
import ErrorBoundary from "@/components/AppShell/ErrorBoundary";

type ReplyReferenceModalProps = {
    issueId: string;
    isModalOpen: boolean;
    setIsModalOpen: (value: boolean) => void;
    replyFactList: Fact[];
    setReplyFactList: Dispatch<SetStateAction<Fact[]>>;
};

export default function ReplyReferenceModal({
    issueId,
    isModalOpen,
    setIsModalOpen,
    replyFactList,
    setReplyFactList,
}: ReplyReferenceModalProps) {
    const {
        addFactToReferenceMarker,
        removeFactFromReferenceMarker,
        removeFactFromAllReferenceMarker,
        getCurSelectedFacts,
    } = useContext(ReferenceMarkerContext);

    const [creationId, setCreationId] = useState<string | null>(null);
    const [cookie] = useCookies(["auth_token"]);
    const [searchValue, setSearchValue] = useState<string>("");

    const { data, error } = useInfiniteQuery({
        queryKey: ["facts", issueId],
        queryFn: ({ pageParam }) =>
            getPaginatedFacts(pageParam, 200, cookie.auth_token),

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

    const addFact = (factId: string) => {
        // Check if the selected fact exists in replyFactList
        const factInreplyFactList = replyFactList.some(
            (fact) => fact.id === factId,
        );
        if (factInreplyFactList) {
            throw new Error("Selected fact already exists in replyFactList");
        }

        const selectedFact = data?.pages
            .flatMap((page) => page.content)
            .find((fact) => fact.id === factId);
        if (!selectedFact) {
            throw new Error("Cannot select the selected fact");
        }

        setReplyFactList((prev) => [...prev, selectedFact]);
    };

    const removeFact = (factId: string) => {
        // Find the array index of the fact to be removed
        const factIndex = replyFactList.findIndex(
            (fact) => String(fact.id) === factId,
        );
        if (factIndex === -1) {
            throw new Error("Cannot find the selected fact in the list");
        }

        // Remove the fact from the FactList array
        setReplyFactList((prev) =>
            prev.filter((fact) => String(fact.id) !== factId),
        );

        // Update Reference Markers
        removeFactFromAllReferenceMarker(factIndex);
    };

    return (
        <Modal
            opened={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            classNames={{
                title: "font-bold text-black",
            }}
            centered
            title="引註事實"
            size="lg"
        >
            <ErrorBoundary>
                <Select
                    variant="unstyled"
                    searchable
                    clearable
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onDropdownClose={() => setSearchValue("")}
                    checkIconPosition="right"
                    radius={0}
                    classNames={{
                        root: "w-full",
                        input: "ml-1 bg-transparent text-lg font-normal text-neutral-500 focus-within:outline-b-2 focus-within:border-b-emerald-500 focus-within:outline-none",
                    }}
                    placeholder="搜尋 CommonGround"
                    leftSection={
                        <MagnifyingGlassIcon className="inline-block h-5 w-5 stroke-neutral-500" />
                    }
                    leftSectionWidth={20}
                    onChange={(selectedFactId) => {
                        if (!selectedFactId) return;
                        addFact(selectedFactId);
                    }}
                    data={data?.pages
                        .flatMap((page) => page.content)
                        .filter(
                            (fact) =>
                                !replyFactList.some(
                                    (replyFact) => replyFact.id === fact.id,
                                ),
                        )
                        .map((fact) => ({
                            value: fact.id,
                            label: fact.title,
                        }))}
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
                <FactCreationModal
                    issueId={issueId}
                    creationID={creationId}
                    setCreationID={setCreationId}
                    factCreationCallback={(facts) =>
                        facts.forEach((fact) => addFact(fact.id))
                    }
                />
                <div className="flex flex-col gap-2">
                    {replyFactList.map((fact, index) => (
                        <EditableReplyReference
                            key={fact.id}
                            fact={fact}
                            removeFact={removeFact}
                            inSelectionMode={true}
                            isSelected={getCurSelectedFacts().includes(index)}
                            setIsSelected={(isSelected) => {
                                if (isSelected) addFactToReferenceMarker(index);
                                else removeFactFromReferenceMarker(index);
                            }}
                        />
                    ))}
                </div>
            </ErrorBoundary>
        </Modal>
    );
}
