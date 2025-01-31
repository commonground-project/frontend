import { parseJsonWhileHandlingErrors } from "../transformers";

type postSubscribeParams = {
    endpoint: string;
    auth_token: string;
};

export const postSubscribe = async ({
    endpoint,
    auth_token,
}: postSubscribeParams): Promise<void> => {
    await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/unsubscribe`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({
                endpoint: endpoint,
            }),
        },
    ).then(parseJsonWhileHandlingErrors);
};
