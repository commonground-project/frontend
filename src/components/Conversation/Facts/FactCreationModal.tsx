"use client";

import { useEffect, useState } from "react";
import { Modal, Button, ActionIcon, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { LinkIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Fact, FactReference } from "@/types/conversations.types";
import ReferenceBar from "./ReferenceBar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaginatedIssueFactsByIdResponse } from "@/lib/requests/issues/getIssueFacts";
import { createIsolatedFact } from "@/lib/requests/facts/createFact";
import { postReference } from "@/lib/requests/references/postReference";
import { websiteCheck } from "@/lib/requests/references/websiteCheck";
import { useCookies } from "react-cookie";
import { relateFactToIssue } from "@/lib/requests/issues/relateFactToIssue";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

type FactModelProps = {
    issueId: string;
    creationID: string | null;
    setCreationID: (newId: string | null) => void;
    factCreationCallback?: (createdFacts: Fact[]) => void;
};

type FactReferenceWithStatus = FactReference & {
    status: "loading" | "success" | "error";
};

export default function FactCreationModal({
    issueId,
    creationID,
    setCreationID,
    factCreationCallback,
}: FactModelProps) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [debouncedUrl] = useDebouncedValue(url, 300);
    const [isUrlValid, setIsUrlValid] = useState(false);
    const [references, setReferences] = useState<FactReferenceWithStatus[]>([]);
    const queryClient = useQueryClient();
    const [cookies] = useCookies(["auth_token"]);

    // Reset state when open a new modal
    useEffect(() => {
        setTitle("");
        setUrl("");
        setIsUrlValid(false);
        setReferences([]);
    }, [creationID]);

    const websiteCheckMutation = useMutation({
        mutationKey: ["websiteCheck"],
        mutationFn: async (url: string) => {
            return websiteCheck({
                url: url,
                auth_token: cookies.auth_token as string,
            });
        },
        onMutate() {
            // Invalidate last mutation
            websiteCheckMutation.reset();
        },
        onSuccess() {
            console.log("Website check success");
            setIsUrlValid((prev) => {
                if (prev) return prev;
                return true;
            });
        },
        onError() {
            console.log("Website check error");
            setIsUrlValid((prev) => {
                if (!prev) return prev;
                return false;
            });
        },
    });

    useEffect(() => {
        if (debouncedUrl) {
            console.log("checking url: ", debouncedUrl);
            websiteCheckMutation.mutate(debouncedUrl);
        }
    }, [debouncedUrl]);

    const addReferenceMutation = useMutation({
        mutationKey: ["addReference"],
        mutationFn: async ({
            url,
            requestId,
        }: {
            url: string;
            requestId: string;
        }) => {
            return postReference({
                url,
                auth_token: cookies.auth_token as string,
            });
        },
        onMutate(variables) {
            // Add a new reference to the list with pending status
            // Optimistic update
            setReferences((prev) => [
                ...prev,
                {
                    id: variables.requestId,
                    createdAt: new Date(),
                    url: variables.url,
                    icon: "",
                    title: "",
                    status: "loading",
                },
            ]);
        },
        onSuccess(data, variables) {
            if (references.find((ref) => ref.id === data.id) !== undefined) {
                console.log("references", references);
                toast.info("引註資料已存在");
                // Remove the preadded reference if it already exists
                setReferences((prev) =>
                    prev.filter((ref) => ref.id !== variables.requestId),
                );
                return;
            }
            // Update the reference with the actual data
            setReferences((prev) =>
                prev.map((ref) =>
                    ref.id === variables.requestId
                        ? { ...data, status: "success" }
                        : ref,
                ),
            );
            setUrl("");
        },
        onError(err, variables) {
            // Remove the reference if the request failed
            setReferences((prev) =>
                prev.filter((ref) => ref.id !== variables.requestId),
            );
            toast.error("建立引註資料時發生錯誤", {
                description:
                    "建立引註資料時發生錯誤，請再試一次或是檢查引註資料連結",
            });
            console.log("error creating reference: ", err);
        },
    });

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
                        ...newQueryData[0].content,
                    ];
                    return {
                        pages: newQueryData,
                        pageParams: queryData.pageParams,
                    };
                },
            );

            queryClient.invalidateQueries({ queryKey: ["facts", issueId] });
            toast.success("事實建立成功");
            setCreationID(null);
            if (factCreationCallback) factCreationCallback(data.facts);
        },
        onError(err) {
            console.error(err);
            toast.error("發生未知的錯誤", {
                description: "建立事實時發生錯誤，請再試一次",
            });
        },
    });

    return (
        <Modal
            opened={creationID !== null}
            onClose={() => setCreationID(null)}
            size="620px"
            centered
            classNames={{
                title: "font-bold text-black",
            }}
            title="引入新的事實"
        >
            <div className="flex min-h-[250px] flex-col justify-between">
                <div>
                    {/* fact title */}
                    <TextInput
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                        variant="unstyled"
                        placeholder="簡述這個事實"
                        classNames={{
                            input: "border-none text-xl placeholder:text-neutral-500 text-neutral-800 font-bold",
                        }}
                        className="pb-2"
                    />

                    {/* reference display */}
                    <div>
                        <h2 className="mb-2 text-sm font-bold">引註資料</h2>
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
                                        disabled={
                                            reference.status === "loading"
                                        }
                                    >
                                        <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    </ActionIcon>
                                    <ReferenceBar
                                        reference={reference}
                                        isLoading={
                                            reference.status === "loading"
                                        }
                                    />
                                    <div className="ml-1 mt-1.5 max-w-[20rem] truncate text-gray-800">
                                        {reference.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    {/* fact URL input */}
                    <div className="flex w-full items-center py-0.5">
                        <LinkIcon className="mr-2 size-5 text-neutral-500" />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 border-none bg-transparent outline-none placeholder:text-neutral-500"
                            placeholder="新增引註資料"
                        />
                        <Button
                            variant="transparent"
                            className="flex items-center gap-1 rounded-full py-1 text-sm text-gray-600 transition-colors hover:text-gray-800 disabled:bg-inherit disabled:text-gray-400"
                            onClick={() => {
                                setIsUrlValid(false);
                                addReferenceMutation.mutate({
                                    url,
                                    requestId: uuidv4(),
                                });
                                setUrl("");
                            }}
                            disabled={!isUrlValid}
                        >
                            <PlusIcon className="size-6" />
                        </Button>
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
                            className="flex items-center rounded-[4px] bg-blue-600 px-4 py-[6px] text-white hover:bg-blue-800 disabled:opacity-50"
                            disabled={
                                title.length < 5 || references.length === 0
                            }
                        >
                            建立
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
