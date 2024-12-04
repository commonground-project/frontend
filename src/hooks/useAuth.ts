import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { COOKIE_AUTH_NAME, COOKIE_OPTIONS } from "@/lib/auth/constants";
import { decodeToken } from "react-jwt";
import { User, Auth } from "@/types/session.types";

export function useAuth(): Auth {
    const [, setCookie, removeCookie] = useCookies([COOKIE_AUTH_NAME]);
    
    const login = (token: string) => {
        const decodedToken = decodeToken<User>(token);

        if (!decodedToken) {
            toast.error("Invalid token");
            return null;
        }
        
        setCookie(COOKIE_AUTH_NAME, token, COOKIE_OPTIONS);
        return decodedToken;
    };

    const logout = () => {
        removeCookie(COOKIE_AUTH_NAME, COOKIE_OPTIONS);
    };

    return { login, logout };
}
