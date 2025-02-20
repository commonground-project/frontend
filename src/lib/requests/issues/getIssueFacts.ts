import type { Fact } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";
import { generateRequestHeaders } from "../generateRequestHeaders";

export type PaginatedIssueFactsByIdResponse = {
    content: Fact[];
    page: {
        size: number;
        totalElement: number;
        totalPage: number;
        number: number;
    };
};

export const getPaginatedIssueFactsById = async (
    issueid: string,
    pageParam: number,
    userToken?: string,
): Promise<PaginatedIssueFactsByIdResponse> => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueid}/facts?page=${pageParam}&size=10`,
        {
            method: "GET",
            headers: generateRequestHeaders(userToken),
        },
    );
    return res.json();
};

export const getPaginatedIssueFactsBySize = async (
    issueid: string,
    pageParam: number,
    userToken?: string,
    size: number = 10,
): Promise<PaginatedIssueFactsByIdResponse> => {
    return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueid}/facts?page=${pageParam}&size=${size}`,
        {
            method: "GET",
            headers: generateRequestHeaders(userToken),
        },
    ).then(parseJsonWhileHandlingErrors);
};
