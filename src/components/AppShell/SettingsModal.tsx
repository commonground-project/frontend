import { Modal, Button, Checkbox } from "@mantine/core";

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
    return (
        <Modal
            opened={opened}
            onClose={() => setopened(false)}
            title={<h1 className="text-xl font-bold">設定</h1>}
        >
            <h2 className="text-base font-medium">通知</h2>
            <Checkbox className="mt-2" label="在我的觀點下有新的回覆時通知我" />
            <Checkbox className="mt-2" label="在我的回覆被節錄時通知我" />
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
