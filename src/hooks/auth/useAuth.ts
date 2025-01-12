import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { decodeToken, useJwt } from "react-jwt";
import { refreshJwtRequest } from "@/lib/requests/auth/refreshJwt";
import type { DecodedToken, User } from "@/types/users.types";

export default function useAuth() {
    const [cookies, setCookie, removeCookie] = useCookies([
        "auth_token",
        "auth_refresh_token",
    ]);
    const [currentToken, setCurrentToken] = useState<string | null>(null);
    const { decodedToken, isExpired, reEvaluateToken } = useJwt<DecodedToken>(
        cookies.auth_token,
    );
    const [user, setUser] = useState<User | null>(null);

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
        },
        [setCookie],
    );

    const logout = useCallback(() => {
        removeCookie("auth_token");
        removeCookie("auth_refresh_token");
    }, [removeCookie]);

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
        if (!cookies.auth_refresh_token) logout();
    }, [logout, cookies.auth_refresh_token]);

    // If the token is expired and there is a refresh token, refresh the token
    useEffect(() => {
        if (
            isExpired &&
            cookies.auth_refresh_token &&
            !refreshTokenMutation.isPending
        ) {
            refreshTokenMutation.mutate(cookies.auth_refresh_token);
        }
    }, [isExpired, cookies.auth_refresh_token, refreshTokenMutation]);

    // Set a timeout to refresh the token before it expires
    useEffect(() => {
        if (!decodedToken || isExpired) return;

        const timeout = setTimeout(
            () => {
                if (!cookies.auth_refresh_token) return;
                refreshTokenMutation.mutate(cookies.auth_refresh_token);
            },
            decodedToken.exp * 1000 - Date.now() - 30000,
        );

        return () => clearTimeout(timeout);
    }, [
        cookies.auth_refresh_token,
        isExpired,
        decodedToken,
        refreshTokenMutation,
    ]);

    // Set the user when the token is decoded
    useEffect(() => {
        if (!decodedToken) {
            setUser(null);
            return;
        }

        setUser({
            id: decodedToken.sub,
            username: decodedToken.username,
            nickname: decodedToken.nickname,
            avatar: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/avatar/${decodedToken.username}`,
        });
    }, [decodedToken]);

    return {
        user,
        login,
        logout,
    };
}
