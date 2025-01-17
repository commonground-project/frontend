"use client";

import useAuth from "@/hooks/auth/useAuth";
import { useHeaderStore } from "@/lib/stores/headerStore";
import { Cog8ToothIcon } from "@heroicons/react/16/solid";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { ActionIcon, Avatar, Button, Menu } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const { user, logout } = useAuth();
    const headerStore = useHeaderStore();
    const router = useRouter();

    return (
        <div className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between bg-neutral-100 px-7">
            <div />
            <Link href="/">
                <h1 className="text-2xl font-bold text-black">CommonGround</h1>
            </Link>
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
        </div>
    );
}
