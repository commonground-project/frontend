import { parseJsonWhileHandlingErrors } from "../transformers";
import type { Reply } from "@/types/conversations.types";
import type { PaginatedPage } from "@/types/requests.types";

export const getViewpointReplies = async (
    viewpointId: string,
    page: number,
    user_token: string,
    size: number = 10,
    sort: string = "createdAt;asc",
): Promise<PaginatedPage<Reply>> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/viewpoint/${viewpointId}/replies?page=${page}&size=${size}&sort=${sort}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user_token}`,
            },
        },
    )
        .then(parseJsonWhileHandlingErrors)
        .then((data: PaginatedPage<Reply>) => ({
            ...data,
            content: data.content.map((reply) => ({
                ...reply,
                createdAt: new Date(reply.createdAt),
                updatedAt: new Date(reply.updatedAt),
            })),
        }));
};
