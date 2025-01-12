import type { Issue } from "@/types/conversations.types";

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
    ).then((res) => {
        if (!res.ok) throw new Error(`Error fetching issues: ${res.status}`);
        return res.json();
    });
};
