import { parseJsonWhileHandlingErrors } from "../transformers";

export type PostReplyParams = {
    content: string;
    quotes: { replyId: string; start: number; end: number }[];
    facts: string[];
};

export const postReply = async (
    payload: PostReplyParams,
    viewpointId: string,
    auth_token: string,
) => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/viewpoint/${viewpointId}/replies`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify(payload),
        },
    ).then(parseJsonWhileHandlingErrors);
};
