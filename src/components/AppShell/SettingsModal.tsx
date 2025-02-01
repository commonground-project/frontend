"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Modal, Button, Checkbox } from "@mantine/core";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserSettings } from "@/lib/requests/settings/getUserSettings";
import { postSubscribe } from "@/lib/requests/settings/postSubscribe";
import type { WebPushSubscription } from "@/types/users.types";
import { putUserSettings } from "@/lib/requests/settings/putUserSettings";

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
    const [cookie] = useCookies(["auth_token"]);

    const { data } = useQuery({
        queryKey: ["getUserSettings"],
        queryFn: () => getUserSettings({ auth_token: cookie.auth_token }),
    });

    const [newReplyInMyViewpoint, setNewReplyInMyViewpoint] = useState(false);
    const [newReferenceToMyReply, setNewReferenceToMyReply] = useState(false);

    useEffect(() => {
        if (data) {
            console.log("user settings: ", data);
            setNewReplyInMyViewpoint(data.notification.newReplyInMyViewpoint);
            setNewReferenceToMyReply(data.notification.newReferenceToMyReply);
        }
    }, [data]);

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

    const putUserSettingsMutation = useMutation({
        mutationKey: ["putUserSettings"],
        mutationFn: async () =>
            putUserSettings({
                settings: {
                    notification: {
                        newReplyInMyViewpoint,
                        newReferenceToMyReply,
                    },
                },
                auth_token: cookie.auth_token,
            }),
        onSuccess() {
            console.log("Successfully updated user settings");
        },
        onError() {
            console.error("Failed to update user settings");
        },
    });

    return (
        <Modal
            opened={opened}
            onClose={() => setopened(false)}
            title="設定"
            classNames={{
                title: "text-xl font-bold",
            }}
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
                    loading={putUserSettingsMutation.isPending}
                >
                    儲存
                </Button>
            </div>
        </Modal>
    );
}
