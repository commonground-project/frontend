import type { Fact } from "@/types/conversations.types";

export type relateFactToIssueResponse = {
    facts: Fact[];
};

export const relateFactToIssue = async (
    factId: string,
    issueId: string,
    userToken: string,
): Promise<relateFactToIssueResponse> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}/facts`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ factIds: [factId] }),
        },
    ).then(async (res) => {
        const data = await res.json();
        return data;
    });
};
