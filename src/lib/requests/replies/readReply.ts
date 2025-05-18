import { parseJsonWhileHandlingErrors } from "../transformers";
import type { ReadObject } from "@/types/conversations.types";

type ReadReplyParams = {
    replyId: string;
    auth_token: string;
};

export const readReply = async ({
    replyId,
    auth_token,
}: ReadReplyParams): Promise<ReadObject> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/read/reply/${replyId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    ).then(parseJsonWhileHandlingErrors);
};
