import { parseJsonWhileHandlingErrors } from "../transformers";
import type { ReadObject } from "@/types/conversations.types";

type ReadViewpointParams = {
    issueId: string;
    auth_token: string;
};

export const readIssue = async ({
    issueId,
    auth_token,
}: ReadViewpointParams): Promise<ReadObject> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/read/issue/${issueId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    ).then(parseJsonWhileHandlingErrors);
};
