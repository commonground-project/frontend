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

const arrayBufferToBase64 = (buffer: ArrayBuffer | null): string => {
    if (!buffer) return "";
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

export const generateSubscriptionObject =
    async (): Promise<WebPushSubscription> => {
        // Get a PushSubscription object
        const serviceWorker = new ServiceWorkerRegistration();
        const pushSubscription = await serviceWorker.pushManager.subscribe();

        // Create an object containing the information needed by the app server
        const subscriptionObject = {
            endpoint: pushSubscription.endpoint,
            keys: {
                p256dh: arrayBufferToBase64(pushSubscription.getKey("p256dh")),
                auth: arrayBufferToBase64(pushSubscription.getKey("auth")),
            },
        };

        return subscriptionObject;
    };
