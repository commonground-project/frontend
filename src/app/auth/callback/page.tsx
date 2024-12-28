"use client";

import useAuth from "@/hooks/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CallbackPage() {
    const router = useRouter();
    const { login } = useAuth();

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

        router.push(redirectTo ? redirectTo : "/");
    }, []);

    return <div></div>;
}
