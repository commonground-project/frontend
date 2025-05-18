"use client";

import { AuthContext } from "@/lib/auth/authContext";
import { useHeaderStore } from "@/lib/stores/headerStore";
import { Button } from "@mantine/core";
import Link from "next/link";
import { useContext } from "react";
import UserMenu from "./UserMenu";

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const headerStore = useHeaderStore();

    return (
        <div className="fixed left-0 right-0 top-0 z-20 flex h-12 items-center justify-center bg-neutral-100 px-7 md:h-14 md:justify-between">
            <div />
            <Link href="/" className="inline-flex items-center gap-[7px]">
                <img
                    src="/assets/LogoGreen.svg"
                    alt="logo"
                    className="size-7 md:size-8"
                />
                <img
                    src="/assets/LogoTextGreen.svg"
                    alt="logo"
                    className="h-3 md:h-4"
                />
            </Link>
            <div className="hidden md:block">
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
        </div>
    );
}
