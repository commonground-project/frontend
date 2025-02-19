"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { decodeToken, useJwt } from "react-jwt";
import { refreshJwtRequest } from "@/lib/requests/auth/refreshJwt";
import type { DecodedToken, User } from "@/types/users.types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthContext } from "@/lib/auth/authContext";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cookies, setCookie, removeCookie] = useCookies([
        "auth_token",
        "auth_refresh_token",
    ]);
    const [currentToken, setCurrentToken] = useState<string | null>(null);
    const { decodedToken, reEvaluateToken } = useJwt<DecodedToken>(
        cookies.auth_token,
    );
    const [user, setUser] = useState<User | null>(null);

    const router = useRouter();

    const login = useCallback(
        (
            token: string,
            refresh_token: string,
            refresh_token_expiration: number,
        ) => {
            const newToken = decodeToken<DecodedToken>(token);

            if (!newToken) throw new Error("Invalid token");

            const current_time = new Date().getTime();
            const tokenAge = current_time - newToken.iat * 1000;
            if (tokenAge > 30000) {
                throw new Error("Token is too old, please re-login");
            }

            setCookie("auth_token", token, {
                expires: new Date(newToken.exp * 1000),
                httpOnly: false,
                path: "/",
            });
            setCookie("auth_refresh_token", refresh_token, {
                expires: new Date(refresh_token_expiration),
                httpOnly: false,
                path: "/",
            });
            reEvaluateToken(token);
        },
        // Disabling the eslint rule because reEvaluateToken is a function that
        // always updates upon calling, no matter the token changes or not
        // Thus, including reEvaluateToken causes an infinite loop

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [setCookie],
    );

    const logout = useCallback(
        (redirect?: string) => {
            removeCookie("auth_token", { path: "/" });
            removeCookie("auth_refresh_token", { path: "/" });
            if (redirect) router.push(redirect);
        },
        [removeCookie, router],
    );

    const refreshTokenMutation = useMutation({
        mutationFn: (refresh_token: string) => refreshJwtRequest(refresh_token),
        onSuccess(data) {
            login(data.accessToken, data.refreshToken, data.expirationTime);
        },
    });

    // Re-evaluate the token when the cookie changes
    useEffect(() => {
        if (cookies.auth_token != currentToken) {
            setCurrentToken(cookies.auth_token);
            reEvaluateToken(cookies.auth_token);
        }
    }, [cookies.auth_token, currentToken, reEvaluateToken, setCurrentToken]);

    // Remove the token if the refresh token is missing
    useEffect(() => {
        if (cookies.auth_token && !cookies.auth_refresh_token) {
            toast.error("驗證登入狀態時發生錯誤，請重新登入");
            logout("/login");
        }
    }, [logout, cookies.auth_token, cookies.auth_refresh_token]);

    // Set a timeout to refresh the token before it expires
    useEffect(() => {
        if (!decodedToken) return;

        const expirationTime = Math.min(
            decodedToken.exp * 1000 - Date.now() - 30000,
            2147483647,
        );

        const timeout = setTimeout(() => {
            if (!cookies.auth_refresh_token || refreshTokenMutation.isPending)
                return;
        }, expirationTime);
        return () => clearTimeout(timeout);
    }, [cookies.auth_refresh_token, decodedToken, refreshTokenMutation]);

    // Set the user when the token is decoded
    useEffect(() => {
        if (!decodedToken) return setUser(null);

        setUser({
            id: decodedToken.sub,
            username: decodedToken.username,
            nickname: decodedToken.nickname,
            avatar: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/avatar/${decodedToken.username}`,
        });
    }, [decodedToken]);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
