export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export interface User {
    name: string | null;
    email: string | null;
    profile_image: string | null;
}

export interface Session {
    data: User | null;
    status: SessionStatus;
    login: (token: string) => void;
    logout: () => void;
}
