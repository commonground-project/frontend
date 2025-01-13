import type { Reaction } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";

type postViewpointReactionParams = {
    viewpointId: string;
    reaction: Reaction;
    auth_token: string;
};

type postViewpointReactionResponse = {
    reaction: Reaction;
};

export const postViewpointReaction = async ({
    viewpointId,
    reaction,
    auth_token,
}: postViewpointReactionParams): Promise<postViewpointReactionResponse> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/viewpoint/${viewpointId}/reaction/me`,
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
