import { decodeToken } from "react-jwt";
import { User } from "@/types/session.types";

export function authService(token: string): User | null {
    try {
        const decoded = decodeToken<User>(token);

        if (!decoded) {
            return null;
        }

        return {
            username: decoded.username ?? null,
            email: decoded.email ?? null,
            nickname: decoded.nickname ?? null,
            avatar: decoded.avatar ?? null,
        };
    } catch {
        return null;
    }
}
