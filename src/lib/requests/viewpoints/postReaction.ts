import { Reaction } from "@/types/conversations.types";

type postReactionProps = {
    viewpointId: string;
    reaction: Reaction;
    auth_token: string;
};

type postReactionResponse = {
    reaction: Reaction;
};

export const postReaction = async ({
    viewpointId,
    reaction,
    auth_token,
}: postReactionProps): Promise<postReactionResponse> => {
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
    ).then((res) => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        } else return res.json();
    });
};
