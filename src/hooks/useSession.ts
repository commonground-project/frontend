import { useState, useEffect } from "react";
import { decodeToken } from "react-jwt";
import { useCookies } from "react-cookie";
import { User, Session } from "@/types/session.types";
import { COOKIE_AUTH_NAME, COOKIE_OPTIONS } from "@/lib/auth/constants";

export function useSession(): Session {
    const [cookies, setCookie, removeCookie] = useCookies([COOKIE_AUTH_NAME]);
    const [session, setSession] = useState<Session>({
        data: null,
        status: "loading",
        login: () => {},
        logout: () => {},
    });

    useEffect(() => {
        checkSession();
    });
    // 起床改
    const checkSession = () => {
        try {
            const token = cookies[COOKIE_AUTH_NAME];

            if (!token) {
                setSession({
                    data: null,
                    status: "unauthenticated",
                    login: handleLogin,
                    logout: handleLogout,
                });
                return;
            }

            const user = decodeToken<User>(token);

            if (!user) {
                handleLogout();
                return;
            }

            setSession({
                data: {
                    name: user.name ?? null,
                    email: user.email ?? null,
                    profile_image: user.profile_image ?? null,
                },
                status: "authenticated",
                login: handleLogin,
                logout: handleLogout,
            });
        } catch (error) {
            console.error("Session check failed:", error);
            handleLogout();
        }
    };

    const handleLogin = (token: string) => {
        setCookie(COOKIE_AUTH_NAME, token, COOKIE_OPTIONS);
    };

    const handleLogout = () => {
        removeCookie(COOKIE_AUTH_NAME, COOKIE_OPTIONS);
        setSession({
            data: null,
            status: "unauthenticated",
            login: handleLogin,
            logout: handleLogout,
        });
    };

    return {
        ...session,
        login: handleLogin,
        logout: handleLogout,
    };
}
