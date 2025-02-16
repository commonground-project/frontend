"use client";

import { AuthContext } from "@/lib/auth/authContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { toast } from "sonner";
import { subscribeWebPush } from "@/lib/requests/settings/postSubscribe";
import { decodeToken } from "react-jwt";
import type { DecodedToken } from "@/types/users.types";

export default function CallbackPage() {
    const router = useRouter();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const auth_token = urlParams.get("token");
        const auth_refresh_token = urlParams.get("refreshToken");
        const redirectTo = urlParams.get("r");

        if (!auth_token || !auth_refresh_token) {
            toast.error("登入失敗", {
                description: "發生錯誤，請再試一次",
            });
            console.error("Both token and refreshToken are required to login");
            return router.push("/login");
        }

        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);

        try {
            login(auth_token, auth_refresh_token, expiry.getTime());
        } catch (error) {
            toast.error("登入失敗", {
                description: "發生錯誤，請再試一次",
            });
            console.error("Error logging in", error);
            return router.push("/login");
        }

        const decodedToken = decodeToken<DecodedToken>(auth_token ?? "");

        // Don't subscribe when the user is not fully set up
        if (decodedToken?.role !== "ROLE_NOT_SETUP")
            subscribeWebPush({ auth_token });

        router.push(redirectTo ? decodeURI(redirectTo) : "/");
    }, [login, router]);

    return <div></div>;
}
