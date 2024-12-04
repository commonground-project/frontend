import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useJwt } from "react-jwt";
import { Session, User } from "@/types/session.types";
import { COOKIE_AUTH_NAME } from "@/lib/auth/constants";

export default function useSession(): Session {
    const [cookies] = useCookies([COOKIE_AUTH_NAME]);
    const { decodedToken, isExpired, reEvaluateToken } = useJwt<User>(cookies[COOKIE_AUTH_NAME]);

    useEffect(() => {
        const sessionToken = cookies[COOKIE_AUTH_NAME];
        if (!sessionToken) {
            return;
        }

        if (sessionToken && !decodedToken) {
            reEvaluateToken(sessionToken);
        }

    }, [cookies, decodedToken, reEvaluateToken]);


    if (!decodedToken || isExpired) {
        return { data: null };
    }

    return { data: decodedToken };
}
