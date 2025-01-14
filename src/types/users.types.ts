export type UserRoles = "ROLE_ADMIN" | "ROLE_USER" | "ROLE_NOT_SETUP";

export interface DecodedToken {
    iss: string;
    sub: string;
    role: UserRoles;
    username: string;
    nickname: string;
    email: string;
    jti: string;
    iat: number;
    exp: number;
}

export interface User {
    id: string;
    username: string;
    nickname: string;
    avatar: string;
}

export interface UserProfile {
    id: string;
    nickname: string;
    avatar: string;
}
