"use client";

import { useHeaderStore } from "@/lib/stores/headerStore";
import { useContext } from "react";
import {
    PencilSquareIcon as PencilSquareIconOutline,
    HomeIcon as HomeIconOutline,
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
    HomeIconVariant?: "solid" | "outline" | "none";
    PencilIconVariant?: "solid" | "outline" | "none";
};

export default function Footer({
    HomeIconVariant = "outline",
    PencilIconVariant = "outline",
}: FooterProps) {
    const { user, logout } = useContext(AuthContext);
    const headerStore = useHeaderStore();

    return (
        <div className="flex h-16 w-full justify-evenly bg-white pb-6 pt-2">
            {HomeIconVariant !== "none" && (
                <ActionIcon variant="transparent" className="size-8">
                    <Link href="/">
                        {HomeIconVariant === "solid" ? (
                            <HomeIconSolid className="size-8 text-black" />
                        ) : (
                            <HomeIconOutline className="size-8 text-black" />
                        )}
                    </Link>
                </ActionIcon>
            )}

            {PencilIconVariant !== "none" && (
                <ActionIcon variant="transparent" className="size-8">
                    {PencilIconVariant === "solid" ? (
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
                    <Button>登入</Button>
                </Link>
            )}
        </div>
    );
}
