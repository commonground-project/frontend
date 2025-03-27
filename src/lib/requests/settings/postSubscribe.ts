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

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export const generateSubscriptionObject =
    async (): Promise<WebPushSubscription> => {
        // register service worker
        const registration = await navigator.serviceWorker.ready;

        const publicVapidKey =
            "BCWPohXk_M13Y8Mj8TenEgzINHJNxj1IxTZ0F-GqBSCQWPAyeI7-Dw5c1sZKKYH8j1OcIM9fP24w7g-cwWBBKM8"; // Replace with your actual VAPID public key

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        // Extract the subscription details
        const subscriptionObject = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: arrayBufferToBase64(subscription.getKey("p256dh")),
                auth: arrayBufferToBase64(subscription.getKey("auth")),
            },
        };

        console.log("subscriptionObject: ", subscriptionObject);
        return subscriptionObject;
    };

export type subscribeWebPushParams = {
    auth_token: string;
};

export const subscribeWebPush = async ({
    auth_token,
}: subscribeWebPushParams) => {
    // Register service worker
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/serviceWorker.js").catch((error) => {
            console.error("Service Worker registration failed:", error);
        });
    }

    // Request Notification and Push Permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    // Get the push subscription object
    const subscriptionObject = await generateSubscriptionObject();

    // Send the subscription info to the server
    try {
        await postSubscribe({
            subscription: subscriptionObject,
            auth_token,
        });
    } catch (error) {
        console.error("Failed to subscribe to push notifications: ", error);
    }
};
