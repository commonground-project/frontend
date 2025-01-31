"use client";

import { useState } from "react";
import { useCookies } from "react-cookie";
import { Modal, Button, Checkbox } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { postSubscribe } from "@/lib/requests/settings/postSubscribe";
import type { WebPushSubscription } from "@/types/users.types";

type SettingModalProps = {
    opened: boolean;
    setopened: (newState: boolean) => void;
    settingModalCallback?: () => void;
};

export default function SettingsModal({
    opened,
    setopened,
    settingModalCallback,
}: SettingModalProps) {
    const [newReplyInMyViewpoint, setNewReplyInMyViewpoint] = useState(false);
    const [newReferenceToMyReply, setNewReferenceToMyReply] = useState(false);
    const [cookie] = useCookies(["auth_token"]);

    const arrayBufferToBase64 = (buffer: ArrayBuffer | null): string => {
        if (!buffer) return "";
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    };

    const generateSubscriptionObject =
        async (): Promise<WebPushSubscription> => {
            // Get a PushSubscription object
            const serviceWorker = new ServiceWorkerRegistration();
            const pushSubscription =
                await serviceWorker.pushManager.subscribe();

            // Create an object containing the information needed by the app server
            const subscriptionObject = {
                endpoint: pushSubscription.endpoint,
                keys: {
                    p256dh: arrayBufferToBase64(
                        pushSubscription.getKey("p256dh"),
                    ),
                    auth: arrayBufferToBase64(pushSubscription.getKey("auth")),
                },
            };

            return subscriptionObject;
        };

    const postSubscribeMutation = useMutation({
        mutationKey: ["postSubscribe"],
        mutationFn: async () =>
            postSubscribe({
                subscription: await generateSubscriptionObject(),
                auth_token: cookie.auth_token,
            }),
        onSuccess() {
            console.log("Successfully subscribed");
        },
        onError() {
            console.error("Failed to subscribe");
        },
    });

    return (
        <Modal
            opened={opened}
            onClose={() => setopened(false)}
            title={<h1 className="text-xl font-bold">設定</h1>}
        >
            <h2 className="text-base font-medium">通知</h2>
            <Checkbox
                checked={newReplyInMyViewpoint}
                onChange={(event) =>
                    setNewReplyInMyViewpoint(event.currentTarget.checked)
                }
                className="mt-2"
                label="在我的觀點下有新的回覆時通知我"
            />
            <Checkbox
                checked={newReferenceToMyReply}
                onChange={(event) =>
                    setNewReferenceToMyReply(event.currentTarget.checked)
                }
                className="mt-2"
                label="在我的回覆被節錄時通知我"
            />
            <div className="flex justify-end">
                <Button
                    onClick={() => {
                        if (settingModalCallback) settingModalCallback();
                        setopened(false);
                    }}
                >
                    儲存
                </Button>
            </div>
        </Modal>
    );
}
