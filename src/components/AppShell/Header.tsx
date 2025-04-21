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
        <div className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-between bg-neutral-100 px-7">
            <div />
            <Link href="/">
                <h1 className="font-serif text-2xl font-bold text-black">
                    CommonGround
                </h1>
            </Link>
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
