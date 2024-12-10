import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { decodeToken, useJwt } from "react-jwt";
import { toast } from "sonner";
import { DecodedToken, User } from "@/types/session.types";

interface Session {
    data: User | null;
    login: (token: string) => User | null;
    logout: () => void;
}

export default function useSession(): Session {
    const [cookies, setCookie, removeCookie] = useCookies(['user-token']);
    const { decodedToken, isExpired, reEvaluateToken } = useJwt<User>(
        cookies['user-token'],
    );

    useEffect(() => {
        const sessionToken = cookies['user-token'];
        if (!sessionToken) {
            return;
        }

        if (sessionToken && (!decodedToken || isExpired)) {
            removeCookie('user-token');
            reEvaluateToken(sessionToken);
            toast.error("Session expired. Please login again.");
            return;
        }
    }, [cookies, decodedToken, isExpired, reEvaluateToken, removeCookie]);

    const login = (token: string) => {
        const userDecodedToken = decodeToken<DecodedToken>(token);
        
        if (!userDecodedToken) {
            toast.error("Invalid token");
            return null;
        }

        const userToken = {
            role: userDecodedToken.role,
            username: userDecodedToken.username,
            email: userDecodedToken.email,
            nickname: userDecodedToken.nickname
        }

        setCookie('user-token', token, {
            expires: new Date(userDecodedToken.exp * 1000),
        });

        reEvaluateToken(token);
        return userToken;
    };

    const logout = () => {
        removeCookie('user-token');
        reEvaluateToken("");
    };

    if (!decodedToken || isExpired) {
        return { data: null, login, logout };
    }

    const userToken = {
        role: decodedToken.role,
        username: decodedToken.username,
        email: decodedToken.email,
        nickname: decodedToken.nickname
    };

    return { data: userToken, login, logout };
}
