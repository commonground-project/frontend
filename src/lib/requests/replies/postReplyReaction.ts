import { Reaction } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";

export const postReplyReaction = async (
    replyId: string,
    reaction: Reaction,
    auth_token: string,
) => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reply/${replyId}/reaction/me`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({
                reaction: reaction,
            }),
        },
    ).then(parseJsonWhileHandlingErrors);
};
