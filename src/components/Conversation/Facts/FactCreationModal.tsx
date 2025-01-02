"use client";

import { useEffect, useRef, useState } from "react";
import { Modal, Button, ActionIcon, TextInput } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import {
    LinkIcon,
    PlusIcon,
    XMarkIcon,
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from "@heroicons/react/24/outline";
import type { Fact, FactReference } from "@/types/conversations.types";
import ReferenceBar from "./ReferenceBar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaginatedIssueFactsByIdResponse } from "@/lib/requests/issues/getIssueFacts";
import { createIsolatedFact } from "@/lib/requests/facts/createFact";
import { useCookies } from "react-cookie";
import { relateFactToIssue } from "@/lib/requests/issues/relateFactToIssue";
import { toast } from "sonner";

type FactModelProps = {
    issueId: string;
    creationID: string | null;
    setCreationID: (newId: string | null) => void;
    factCreationCallback?: (createdFacts: Fact[]) => void;
};

export default function FactCreationModal({
    issueId,
    creationID,
    setCreationID,
    factCreationCallback,
}: FactModelProps) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("https://you.com");
    const [references, setReferences] = useState<FactReference[]>([]);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const queryClient = useQueryClient();
    const [cookies] = useCookies(["auth_token"]);

    useEffect(() => {
        setTitle("");
        setUrl("https://you.com");
        setReferences([]);
    }, [creationID]);

    const addReference = () => {
        setReferences((prev) => [
            ...prev,
            {
                id: uuidv4(),
                url: url,
                createdAt: new Date(),
                icon: "/favicon.ico",
                title:
                    iframeRef.current?.contentDocument?.title ??
                    "無法取得網頁標題",
            },
        ]);
    };

    const createFactMutation = useMutation({
        mutationKey: ["createFact", creationID],
        mutationFn: async (vars: {
            title: string;
            references: FactReference[];
        }) => {
            const isolatedFact = await createIsolatedFact(
                cookies.auth_token as string,
                JSON.stringify({
                    title: vars.title,
                    references: vars.references,
                }),
            );
            const correlatedFact = await relateFactToIssue(
                isolatedFact.id,
                issueId,
                cookies.auth_token as string,
            );
            return correlatedFact;
        },
        onSuccess(data) {
            queryClient.setQueryData(
                ["facts", issueId],
                (queryData: {
                    pages: PaginatedIssueFactsByIdResponse[];
                    pageParams: number[];
                }) => {
                    const newQueryData = queryData.pages;
                    newQueryData[0].content = [
                        ...data.facts,
                        ...data.facts,
                        ...newQueryData[0].content,
                    ];
                    return {
                        pages: newQueryData,
                        pageParams: queryData.pageParams,
                    };
                },
            );

            queryClient.invalidateQueries({ queryKey: ["facts", issueId] });
            setCreationID(null);
            if (factCreationCallback) factCreationCallback(data.facts);
        },
        onError(err) {
            console.error(err);
            toast.error("發生位置的錯誤", {
                description: "建立事實時發生錯誤，請再試一次",
            });
        },
    });

    return (
        <Modal
            opened={creationID !== null}
            onClose={() => setCreationID(null)}
            size="70rem"
            centered
            withCloseButton={false}
        >
            <Button
                variant="transparent"
                color="black"
                leftSection={<ArrowLongLeftIcon className="mr-1 h-5 w-5" />}
                onClick={() => setCreationID(null)}
                className="text-lg font-semibold text-neutral-500 transition-colors duration-200 hover:text-neutral-700"
            >
                返回所有事實
            </Button>
            {/* Modal Content */}
            <div className="flex h-[80vh] max-h-[600px] font-sans">
                <div className="w-2/3 p-2">
                    <TextInput
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                        variant="unstyled"
                        placeholder="用一句話簡述這個事實"
                        classNames={{
                            input: "text-2xl placeholder:text-neutral-500 text-neutral-800 font-bold",
                        }}
                        className="pb-2"
                    />
                    <div className="flex w-full items-center rounded-full border border-gray-200 px-3 py-0.5 shadow-sm">
                        <LinkIcon className="mr-2 h-4 w-4 text-black" />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 border-none bg-transparent outline-none placeholder:text-gray-500"
                        />
                        <button
                            className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-gray-500 transition-colors hover:text-gray-800"
                            onClick={addReference}
                        >
                            <span>新增至引註資料</span>
                            <ArrowLongRightIcon className="h-4 w-4" />
                        </button>
                    </div>
                    {/* Preview */}
                    <div className="mt-2 flex h-[calc(60vh-75px)] overflow-hidden rounded-lg border border-gray-200">
                        <iframe
                            src={url}
                            className="h-full w-full"
                            title="網頁預覽"
                            ref={iframeRef}
                        />
                    </div>
                </div>

                {/* Right Side - References */}
                <div className="flex h-full w-1/3 flex-col justify-between p-2">
                    <div>
                        <h2 className="mb-2 text-lg font-bold">引註資料</h2>
                        <div className="max-h-[530px] space-y-3 overflow-y-auto pr-2">
                            {references.map((reference) => (
                                <div
                                    key={reference.id}
                                    className="group relative flex flex-col items-start justify-between rounded-lg p-2 hover:bg-gray-50"
                                >
                                    <ActionIcon
                                        variant="transparent"
                                        onClick={() =>
                                            setReferences((prev) =>
                                                prev.filter(
                                                    (ref) =>
                                                        ref.id !== reference.id,
                                                ),
                                            )
                                        }
                                        className="absolute right-1 top-1 opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    </ActionIcon>
                                    <ReferenceBar reference={reference} />
                                    <div className="ml-1 mt-1.5 max-w-[20rem] truncate text-gray-800">
                                        {reference.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-2 flex justify-end">
                        <Button
                            onClick={() => {
                                createFactMutation.mutate({
                                    title,
                                    references,
                                });
                            }}
                            loading={createFactMutation.isPending}
                            className="flex items-center rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-800 disabled:opacity-50"
                            disabled={
                                title.length < 5 || references.length === 0
                            }
                        >
                            <PlusIcon className="mr-1 h-4 w-4" />
                            建立
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
