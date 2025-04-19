"use client";

import { Modal } from "@mantine/core";
import SettingsModalContent from "./SettingsModalContent";

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
    return (
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="設定"
            classNames={{
                title: "text-xl font-bold",
            }}
        >
            <SettingsModalContent
                setOpened={setOpened}
                settingModalCallback={settingModalCallback}
            />
        </Modal>
    );
}
