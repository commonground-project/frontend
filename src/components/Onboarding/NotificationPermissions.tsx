import { ActionIcon } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { BellAlertIcon, BellSlashIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import type { OnboardingNotificationPreferences } from "@/lib/onboarding/forms";

interface NotificationPermissionsProps {
    form: UseFormReturnType<OnboardingNotificationPreferences>;
    setAllowNextStep?: (allow: boolean) => void;
}

export default function NotificationPermissions({
    form,
    setAllowNextStep,
}: NotificationPermissionsProps) {
    useEffect(() => {
        if (!setAllowNextStep) return;
        setAllowNextStep(true);
    }, [form.values, setAllowNextStep]);

    const handleToggle = (checked: boolean) => {
        form.setFieldValue("pushNotifications", checked);
    };

    return (
        <div className="flex h-full flex-col justify-between">
            <p className="text-base md:text-lg">
                錯過時事的通知？就像錯過貓咪影片一樣可惜，你忍心嗎？
            </p>

            <div className="flex h-16 items-center justify-between gap-10 rounded-xl border border-neutral-400 bg-neutral-100 px-5">
                <p className="text-base text-neutral-900 md:text-lg">
                    在我關注的議題與觀點有新活動時通知我
                </p>
                <ActionIcon
                    variant="transparent"
                    onClick={() => handleToggle(!form.values.pushNotifications)}
                >
                    {form.values.pushNotifications ? (
                        <BellAlertIcon className="h-8 w-8 text-emerald-600" />
                    ) : (
                        <BellSlashIcon className="h-8 w-8 text-emerald-600" />
                    )}
                </ActionIcon>
            </div>
        </div>
    );
}
