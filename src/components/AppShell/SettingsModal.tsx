"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Checkbox, Button, Modal } from "@mantine/core";

import { getUserSettings } from "@/lib/requests/settings/getUserSettings";
import { putUserSettings } from "@/lib/requests/settings/putUserSettings";
import ErrorBoundary from "@/components/AppShell/ErrorBoundary";

type SettingModalProps = {
    opened: boolean;
    setOpened: (newState: boolean) => void;
    settingModalCallback?: () => void;
};

export default function SettingsModal({
    opened,
    setOpened,
    settingModalCallback,
}: SettingModalProps) {
    const [cookie] = useCookies(["auth_token"]);

    const { data } = useQuery({
        queryKey: ["getUserSettings"],
        queryFn: () =>
            cookie.auth_token
                ? getUserSettings({ auth_token: cookie.auth_token })
                : null,
    });

    const [newReplyInMyViewpoint, setNewReplyInMyViewpoint] = useState(false);
    const [newEventInFollowedIssue, setNewEventInFollowedIssue] =
        useState(false);
    const [newReplyInFollowedViewpoint, setNewReplyInFollowedViewpoint] =
        useState(false);

    useEffect(() => {
        if (data) {
            console.log("user settings: ", data);
            setNewReplyInMyViewpoint(data.notification.newReplyInMyViewpoint);
            setNewEventInFollowedIssue(
                data.notification.newEventInFollowedIssue,
            );
            setNewReplyInFollowedViewpoint(
                data.notification.newReplyInFollowedViewpoint,
            );
        }
    }, [data]);

    const updateUserSettingsMutation = useMutation({
        mutationKey: ["putUserSettings"],
        mutationFn: async () =>
            putUserSettings({
                settings: {
                    notification: {
                        newReplyInMyViewpoint,
                        newReferenceToMyReply: false,
                        newNodeOfTimelineToFollowedIssue: false,
                        newEventInFollowedIssue,
                        newReplyInFollowedViewpoint,
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
            onClose={() => setOpened(false)}
            title="設定"
            classNames={{
                title: "text-xl font-bold",
            }}
        >
            <ErrorBoundary>
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
                    checked={newEventInFollowedIssue}
                    onChange={(event) =>
                        setNewEventInFollowedIssue(event.currentTarget.checked)
                    }
                    className="mt-2"
                    label="在我關注的觀點下有新的活動時通知我"
                />
                <Checkbox
                    checked={newReplyInFollowedViewpoint}
                    onChange={(event) =>
                        setNewReplyInFollowedViewpoint(
                            event.currentTarget.checked,
                        )
                    }
                    className="mt-2"
                    label="在我關注的觀點下有新的回覆時通知我"
                />
                <div className="flex justify-end">
                    <Button
                        onClick={() => {
                            if (settingModalCallback) settingModalCallback();
                            updateUserSettingsMutation.mutate();
                            setOpened(false);
                        }}
                        loading={updateUserSettingsMutation.isPending}
                    >
                        儲存
                    </Button>
                </div>
            </ErrorBoundary>
        </Modal>
    );
}
