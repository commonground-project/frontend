import type { DecodedToken, User } from "@/types/users.types";
import { decodeToken } from "react-jwt";

export const decodeUserFromString = (token: string): User | null => {
    const decodedToken = decodeToken<DecodedToken>(token);
    if (!decodedToken) return null;

    return {
        id: decodedToken.sub,
        username: decodedToken.username,
        nickname: decodedToken.nickname,
        avatar: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/avatar/${decodedToken.username}`,
    };
};
