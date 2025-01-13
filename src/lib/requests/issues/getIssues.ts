import type { Issue } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";

export type getIssuesResponse = {
    content: Issue[];
    page: {
        size: number;
        totalElement: number;
        totalPage: number;
        number: number;
    };
};

export const getIssues = async (
    pageParams: number,
    userToken: string,
): Promise<getIssuesResponse> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues?page=${pageParams}&size=10`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
            },
        },
    ).then(parseJsonWhileHandlingErrors);
};
