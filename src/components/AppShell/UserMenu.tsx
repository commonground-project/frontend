import { useRouter } from "next/navigation";
import { useState } from "react";
import { ActionIcon, Avatar, Menu } from "@mantine/core";
import {
    Cog8ToothIcon,
    ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import SettingsModal from "@/components/AppShell/SettingsModal";
import type { User } from "@/types/users.types";

type UserMenuProps = {
    user: User;
    logout: () => void;
};

export default function UserMenu({ user, logout }: UserMenuProps) {
    const router = useRouter();
    const [isSettingsModalOpened, setIsSettingsModalOpened] = useState(false);

    return (
        <>
            <Menu>
                <Menu.Target>
                    <ActionIcon variant="transparent" className="size-8">
                        <Avatar
                            variant="transparent"
                            classNames={{
                                image: "size-8",
                            }}
                            color="black"
                            src={`/api/user/avatar/${user.username}`}
                            alt={user.nickname}
                        />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={<Cog8ToothIcon className="w-3" />}
                        onClick={() => setIsSettingsModalOpened(true)}
                    >
                        設定
                    </Menu.Item>
                    <Menu.Item
                        leftSection={
                            <ArrowLeftStartOnRectangleIcon className="w-3" />
                        }
                        onClick={() => {
                            logout();
                            router.push("/");
                        }}
                    >
                        登出
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <SettingsModal
                opened={isSettingsModalOpened}
                setOpened={setIsSettingsModalOpened}
                settingModalCallback={() => console.log("Modal closed")}
            />
        </>
    );
}
