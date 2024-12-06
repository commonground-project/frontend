import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { decodeToken, useJwt } from "react-jwt";
import { toast } from "sonner";
import { Session, User } from "@/types/session.types";
import { COOKIE_AUTH_NAME, COOKIE_OPTIONS } from "@/lib/auth/constants";

export default function useSession(): Session {
    const [cookies, setCookie, removeCookie] = useCookies([COOKIE_AUTH_NAME]);
    const { decodedToken, isExpired, reEvaluateToken } = useJwt<User>(
        cookies[COOKIE_AUTH_NAME],
    );

    useEffect(() => {
        const sessionToken = cookies[COOKIE_AUTH_NAME];
        if (!sessionToken) {
            return;
        }

        if (sessionToken && (!decodedToken || isExpired)) {
            removeCookie(COOKIE_AUTH_NAME, COOKIE_OPTIONS);
            reEvaluateToken(sessionToken);
            toast.error("Session expired. Please login again.");
            return;
        }
    }, [cookies, decodedToken, reEvaluateToken]);

    const login = (token: string) => {
        const decodedToken = decodeToken<User>(token);

        if (!decodedToken) {
            toast.error("Invalid token");
            return null;
        }

        setCookie(COOKIE_AUTH_NAME, token, {
            ...COOKIE_OPTIONS,
            expires: new Date(decodedToken.exp * 1000),
        });
        reEvaluateToken(token);
        return decodedToken;
    };

    const logout = () => {
        removeCookie(COOKIE_AUTH_NAME, COOKIE_OPTIONS);
        reEvaluateToken("");
    };

    if (!decodedToken || isExpired) {
        return { data: null, login, logout };
    }

    return { data: decodedToken, login, logout };
}
