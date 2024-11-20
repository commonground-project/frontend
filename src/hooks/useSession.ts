import { useState, useEffect, useCallback } from "react";
import { decodeToken } from "react-jwt";
import { useCookies } from "react-cookie";
import {
    User,
    Session,
    SessionState,
    SessionStatus,
} from "@/types/session.types";
import { COOKIE_AUTH_NAME, COOKIE_OPTIONS } from "@/lib/auth/constants";

export default function useSession(): Session {
    const [cookies, setCookie, removeCookie] = useCookies([COOKIE_AUTH_NAME]);
    const [session, setSession] = useState<SessionState>({
        data: null,
        status: "loading",
    });
    const sessionToken = cookies[COOKIE_AUTH_NAME];

    const updateSessionState = useCallback(
        (status: SessionStatus, userData: User | null = null) => {
            setSession({
                data: userData,
                status,
            });
        },
        [],
    );

    const handleLogin = useCallback(
        (token: string) => {
            try {
                const user = decodeToken<User>(token);

                if (!user) {
                    throw new Error("Invalid token");
                }

                setCookie(COOKIE_AUTH_NAME, token, COOKIE_OPTIONS);
                updateSessionState("authenticated", {
                    name: user.name ?? null,
                    email: user.email ?? null,
                    image: user.image ?? null,
                });
                console.log("Login successful", user);
            } catch (error) {
                console.error("Login failed:", error);
                updateSessionState("unauthenticated", null);
            }
        },
        [setCookie, updateSessionState],
    );

    const handleLogout = useCallback(() => {
        try {
            removeCookie(COOKIE_AUTH_NAME, COOKIE_OPTIONS);
            updateSessionState("unauthenticated", null);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    }, [removeCookie, updateSessionState]);

    useEffect(() => {
        const checkSession = () => {
            try {
                if (!sessionToken) {
                    updateSessionState("unauthenticated", null);
                    return;
                }

                const user = decodeToken<User>(sessionToken);
                if (!user) {
                    handleLogout();
                    return;
                }

                updateSessionState("authenticated", {
                    name: user.name ?? null,
                    email: user.email ?? null,
                    image: user.image ?? null,
                });
            } catch (error) {
                console.error("Session check failed:", error);
                handleLogout();
            }
        };

        checkSession();
    }, [sessionToken, handleLogout, updateSessionState]);

    return {
        ...session,
        login: handleLogin,
        logout: handleLogout,
    };
}
