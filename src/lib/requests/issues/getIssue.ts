import { Issue } from "@/types/conversations.types";

type getIssueProps = {
    issueId: string;
    auth_token: string;
};

export const getIssue = async ({
    issueId,
    auth_token,
}: getIssueProps): Promise<Issue> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    ).then((res) => {
        if (!res.ok) throw new Error(`Error fetching issue: ${res.status}`);
        return res.json();
    });
};
