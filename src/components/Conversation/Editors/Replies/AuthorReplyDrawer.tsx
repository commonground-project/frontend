"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import {
    postReply,
    type PostReplyParams,
} from "@/lib/requests/replies/postReply";
import type { Reply } from "@/types/conversations.types";
import type { PaginatedPage } from "@/types/requests.types";
import { Button, Drawer } from "@mantine/core";
import AuthorReplyBox from "@/components/Conversation/Editors/Replies/AuthorReplyBox";
import withErrorBoundary from "@/lib/utils/withErrorBoundary";

import type { Fact } from "@/types/conversations.types";
import { set } from "lodash";

type AuthorReplyDrawerProps = {
    issueId: string;
    viewpointId: string;
};

function AuthorReplyDrawer({ issueId, viewpointId }: AuthorReplyDrawerProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [replyFactList, setReplyFactList] = useState<Fact[]>([]);

    const [cookie] = useCookies(["auth_token"]);

    const queryClient = useQueryClient();

    const postReplyMutation = useMutation({
        mutationKey: ["postReply", viewpointId],
        mutationFn: (payload: PostReplyParams) =>
            postReply(payload, viewpointId, cookie.auth_token),
        onSuccess(data) {
            queryClient.setQueryData(
                ["replies", viewpointId],
                (oldData?: {
                    pages: PaginatedPage<Reply>[];
                    pageParams: number[];
                }): {
                    pages: PaginatedPage<Reply>[];
                    pageParams: number[];
                } => {
                    const parsedData = {
                        ...data,
                        createdAt: new Date(data.createdAt),
                        updatedAt: new Date(data.updatedAt),
                    };

                    if (!oldData)
                        return {
                            pages: [
                                {
                                    content: [parsedData],
                                    page: {
                                        number: 0,
                                        totalElement: 1,
                                        totalPage: 1,
                                        size: 10,
                                    },
                                },
                            ],
                            pageParams: [0],
                        };
                    return {
                        pages: [
                            ...oldData.pages.slice(0, -2),
                            {
                                ...oldData.pages[oldData.pages.length - 1],
                                content: [
                                    ...oldData.pages[oldData.pages.length - 1]
                                        .content,
                                    parsedData,
                                ],
                            },
                        ],
                        pageParams: oldData.pageParams,
                    };
                },
            );

            queryClient.invalidateQueries({
                queryKey: ["replies", viewpointId],
            });
            closeDrawer();
        },
        onError(error) {
            console.error(error);
            toast.error("發送回覆時發生未知的錯誤，請再試一次");
        },
    });

    const closeDrawer = () => {
        setIsDrawerOpen(false);
    };

    const postReplyFn = (content: string) => {
        postReplyMutation.mutate({
            content,
            quotes: [],
            facts: replyFactList.map((fact) => fact.id),
        });
    };

    return (
        <>
            <Button
                variant="outline"
                onClick={() => {
                    setIsDrawerOpen(true);
                }}
            >
                Open Drawer
            </Button>
            <Drawer
                opened={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                position="bottom"
                classNames={{
                    title: "hidden",
                    content: "rounded-t-xl",
                }}
                withCloseButton={false}
            >
                <AuthorReplyBox
                    postReplyFn={postReplyFn}
                    closeDrawer={closeDrawer}
                    publishOnProcess={postReplyMutation.status === "pending"}
                />
            </Drawer>
        </>
    );
}

export default withErrorBoundary(AuthorReplyDrawer);
