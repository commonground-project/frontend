import type { Issue } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";
import { generateRequestHeaders } from "../generateRequestHeaders";

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
    auth_token?: string,
): Promise<getIssuesResponse> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues?page=${pageParams}&size=10`,
        {
            method: "GET",
            headers: generateRequestHeaders(auth_token),
        },
    ).then(parseJsonWhileHandlingErrors);
};
