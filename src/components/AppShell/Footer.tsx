"use client";

import { useHeaderStore } from "@/lib/stores/headerStore";
import { useContext } from "react";
import {
    PencilSquareIcon as PencilSquareIconOutline,
    HomeIcon as HomeIconOutline,
    UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
    PencilSquareIcon as PencilSquareIconSolid,
    HomeIcon as HomeIconSolid,
} from "@heroicons/react/24/solid";
import { ActionIcon, Button } from "@mantine/core";
import Link from "next/link";
import { AuthContext } from "@/lib/auth/authContext";
import UserMenu from "@/components/AppShell/UserMenu";

type FooterProps = {
    homeIconVariant?: "solid" | "outline" | "none";
    pencilIconVariant?: "solid" | "outline" | "none";
};

export default function Footer({
    homeIconVariant = "outline",
    pencilIconVariant = "outline",
}: FooterProps) {
    const { user, logout } = useContext(AuthContext);
    const headerStore = useHeaderStore();

    return (
        <div className="flex h-16 w-full justify-around bg-white px-5 pb-6 pt-2">
            {homeIconVariant !== "none" && (
                <ActionIcon variant="transparent" className="size-8">
                    <Link href="/">
                        {homeIconVariant === "solid" ? (
                            <HomeIconSolid className="size-8 text-black" />
                        ) : (
                            <HomeIconOutline className="size-8 text-black" />
                        )}
                    </Link>
                </ActionIcon>
            )}

            {pencilIconVariant !== "none" && (
                <ActionIcon variant="transparent" className="size-8">
                    {pencilIconVariant === "solid" ? (
                        <PencilSquareIconSolid className="size-8 text-black" />
                    ) : (
                        <PencilSquareIconOutline className="size-8 text-black" />
                    )}
                </ActionIcon>
            )}
            {user ? (
                <UserMenu user={user} logout={logout} />
            ) : headerStore.hideLoginButton ? (
                <div />
            ) : (
                <Link href="/login">
                    <UserCircleIcon className="size-8 text-black" />
                </Link>
            )}
        </div>
    );
}
