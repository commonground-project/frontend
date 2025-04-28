"use client";

import { toast } from "sonner";
import { debounce } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { Button, ActionIcon, TextInput } from "@mantine/core";
import {
    LinkIcon,
    PlusIcon,
    TrashIcon,
    ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import type { Fact, FactReference } from "@/types/conversations.types";

import type { PaginatedIssueFactsByIdResponse } from "@/lib/requests/issues/getIssueFacts";
import { createIsolatedFact } from "@/lib/requests/facts/createFact";
import { postReference } from "@/lib/requests/references/postReference";
import { websiteCheck } from "@/lib/requests/references/websiteCheck";
import { relateFactToIssue } from "@/lib/requests/issues/relateFactToIssue";
import ReferenceBar from "@/components/Conversation/Facts/ReferenceBar";

type FactReferenceWithStatus = FactReference & {
    status: "loading" | "success" | "error";
};

type FactCreationBoxProps = {
    issueId: string;
    creationID: string | null;
    factCreationCallback?: (createdFacts: Fact[]) => void;
    goBackButton?: boolean;
    goBackButtonCallback?: () => void;
};

export default function FactCreationBox({
    issueId,
    creationID,
    factCreationCallback, // call when click the create fact button
    goBackButton, // whether to show the go back button
    goBackButtonCallback, // call when click the go back button
}: FactCreationBoxProps) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [__isUrlValid, setIsUrlValid] = useState(false);
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

    const { mutate: websiteCheckMutation, reset: resetWebsitecheck } =
        useMutation({
            mutationKey: ["websiteCheck"],
            mutationFn: async (url: string) => {
                return websiteCheck({
                    url: url,
                    auth_token: cookies.auth_token as string,
                });
            },
            onMutate() {
                // Invalidate last mutation
                resetWebsitecheck();
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

    const checkUrlValidity = useMemo(
        () =>
            debounce((url: string) => {
                console.log("checking url: ", url);
                websiteCheckMutation(url);
            }, 500),
        [websiteCheckMutation],
    );

    useEffect(() => {
        checkUrlValidity(url);
    }, [url, checkUrlValidity]);

    const addReferenceMutation = useMutation({
        mutationKey: ["addReference"],
        mutationFn: async ({
            url,
            temporaryId, // A temporary id to identify the reference before the actual data is fetched
        }: {
            url: string;
            temporaryId: string;
        }) => {
            return {
                reference: await postReference({
                    url,
                    auth_token: cookies.auth_token as string,
                }),
                temporaryId,
            };
        },
        onMutate(variables) {
            // Add a new reference to the list with pending status
            // Optimistic update
            setReferences((prev) => [
                ...prev,
                {
                    id: variables.temporaryId,
                    createdAt: new Date(),
                    url: variables.url,
                    icon: "",
                    title: "",
                    status: "loading",
                },
            ]);
        },
        onSuccess(data, variables) {
            if (
                references.find((ref) => ref.id === data.reference.id) !==
                undefined
            ) {
                console.log("references", references);
                toast.info("引註資料已存在");
                // Remove the preadded reference if it already exists
                setReferences((prev) =>
                    prev.filter((ref) => ref.id !== variables.temporaryId),
                );
                return;
            }
            // Update the reference with the actual data
            setReferences((prev) =>
                prev.map((ref) =>
                    ref.id === variables.temporaryId
                        ? { ...data.reference, status: "success" }
                        : ref,
                ),
            );
            setUrl("");
        },
        onError(err, variables) {
            // Remove the reference if the request failed
            setReferences((prev) =>
                prev.filter((ref) => ref.id !== variables.temporaryId),
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
                    if (!queryData) return;
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
        <div className="flex min-h-[250px] flex-col">
            4{/* fact title */}
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
                            temporaryId: uuidv4(),
                        });
                        setUrl("");
                    }}
                    // disabled={!isUrlValid}
                >
                    <PlusIcon className="size-6" />
                </Button>
            </div>
            {/* reference display */}
            <div>
                <h2 className="mb-2 text-sm font-bold">引註資料</h2>
                <div className="max-h-[530px] space-y-3 overflow-y-auto pr-2">
                    {references.map((reference) => (
                        <div
                            key={reference.id}
                            className="relative flex flex-col items-start justify-between rounded-lg p-2 hover:bg-gray-50"
                        >
                            <ActionIcon
                                variant="transparent"
                                onClick={() =>
                                    setReferences((prev) =>
                                        prev.filter(
                                            (ref) => ref.id !== reference.id,
                                        ),
                                    )
                                }
                                className="absolute right-1 top-1"
                                disabled={reference.status === "loading"}
                            >
                                <TrashIcon className="h-5 w-5 text-neutral-500" />
                            </ActionIcon>
                            <ReferenceBar
                                reference={reference}
                                isLoading={reference.status === "loading"}
                            />
                            <div className="ml-1 mt-1.5 max-w-[20rem] truncate text-gray-800">
                                {reference.title}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Submit Button */}
            <div className="mt-2 flex justify-between gap-4">
                {goBackButton ? (
                    <Button
                        variant="transparent"
                        color="#009966"
                        onClick={() => {
                            if (goBackButtonCallback) goBackButtonCallback();
                        }}
                        className="flex w-5/12 items-center justify-center rounded-[4px] px-4 py-[6px] text-neutral-600 disabled:opacity-70"
                    >
                        <ArrowLeftIcon className="mr-2 size-5" />
                        <div className="text-emerald-600">返回</div>
                    </Button>
                ) : (
                    <div />
                )}
                <Button
                    onClick={() => {
                        createFactMutation.mutate({
                            title,
                            references,
                        });
                    }}
                    loading={createFactMutation.isPending}
                    className="flex w-7/12 items-center justify-center rounded-[4px] px-4 py-[6px] text-white"
                    disabled={title.length < 5 || references.length === 0}
                >
                    <PlusIcon className="mr-2 size-5" />
                    引入事實
                </Button>
            </div>
        </div>
    );
}
