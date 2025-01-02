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
    auth_token: string,
): Promise<PaginatedIssueFactsByIdResponse> => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueid}/facts?page=${pageParam}&size=10`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth_token}`,
            },
        },
    );
    return res.json();
};
