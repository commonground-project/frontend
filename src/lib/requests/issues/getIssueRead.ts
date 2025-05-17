import type { ReadObject } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";
import { generateRequestHeaders } from "../generateRequestHeaders";

type GetIssueReadParams = {
    issueId: string;
    auth_token?: string;
};

export const getIssueRead = async ({
    issueId,
    auth_token,
}: GetIssueReadParams): Promise<ReadObject> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}`,
        {
            method: "GET",
            headers: generateRequestHeaders(auth_token),
        },
    ).then(parseJsonWhileHandlingErrors);
};
