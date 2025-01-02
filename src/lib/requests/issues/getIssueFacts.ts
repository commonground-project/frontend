import type { Fact } from "@/types/conversations.types";

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
    userToken: string,
): Promise<PaginatedIssueFactsByIdResponse> => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueid}/facts?page=${pageParam}&size=10`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
            },
        },
    );
    return res.json();
};

export const getPaginatedIssueFactsBySize = async (
    issueid: string,
    size: number,
    userToken: string,
): Promise<PaginatedIssueFactsByIdResponse> => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueid}/facts?size=${size}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
            },
        },
    );
    return res.json();
};
