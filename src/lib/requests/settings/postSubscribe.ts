import type { WebPushSubscription } from "@/types/users.types";
import { parseJsonWhileHandlingErrors } from "../transformers";

type postSubscribeParams = {
    subscription: WebPushSubscription;
    auth_token: string;
};

export const postSubscribe = async ({
    subscription,
    auth_token,
}: postSubscribeParams): Promise<void> => {
    await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscription/subscribe`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify(subscription),
        },
    ).then(parseJsonWhileHandlingErrors);
};
