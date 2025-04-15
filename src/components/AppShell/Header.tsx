"use client";

import { AuthContext } from "@/lib/auth/authContext";
import { useHeaderStore } from "@/lib/stores/headerStore";
import { Cog8ToothIcon } from "@heroicons/react/16/solid";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Avatar, Button, Menu } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import SettingsModal from "./SettingsModal";

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const headerStore = useHeaderStore();
    const router = useRouter();
    const [isSettingsModalOpened, setIsSettingsModalOpened] = useState(false);

    return (
        <div className="fixed left-0 right-0 top-0 z-20 flex h-12 items-center justify-center bg-neutral-100 px-7 md:h-14 md:justify-between">
            <div />
            <Link href="/" className="inline-flex items-center gap-[7px]">
                <img src="/LogoGreen.svg" alt="logo" className="size-8" />
                <img src="/LogoTextGreen.svg" alt="logo" className="h-4" />
            </Link>
            <div className="hidden md:block">
                {user ? (
                    <Menu position="bottom-end">
                        <Menu.Target>
                            <ActionIcon variant="transparent">
                                <Avatar
                                    variant="transparent"
                                    size={36}
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
                ) : headerStore.hideLoginButton ? (
                    <div />
                ) : (
                    <Link href="/login">
                        <Button>登入</Button>
                    </Link>
                )}
                <SettingsModal
                    opened={isSettingsModalOpened}
                    setOpened={setIsSettingsModalOpened}
                    settingModalCallback={() => console.log("Modal closed")}
                />
            </div>
        </div>
    );
}
