import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { COOKIE_AUTH_NAME, COOKIE_OPTIONS } from "@/lib/auth/constants";
import { authService } from "@/lib/auth/authService";
import { Auth } from "@/types/session.types";

export function useAuth(): Auth {
    const [, setCookie, removeCookie] = useCookies([COOKIE_AUTH_NAME]);

    const login = async (token: string) => {
        try {
            const user = authService(token);
            await setCookie(COOKIE_AUTH_NAME, token, COOKIE_OPTIONS);
            return user;
        } catch (error) {
            toast.error(String(error));
            throw error;
        }
    };

    const logout = async () => {
        try {
            await removeCookie(COOKIE_AUTH_NAME, COOKIE_OPTIONS);
        } catch (error) {
            toast.error(String(error));
            throw error;
        }
    };

    return { login, logout };
}
