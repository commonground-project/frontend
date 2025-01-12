import type { Issue } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../middlewares";

type getIssueParams = {
    issueId: string;
    auth_token: string;
};

export const getIssue = async ({
    issueId,
    auth_token,
}: getIssueParams): Promise<Issue> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    ).then(parseJsonWhileHandlingErrors);
};
