export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export interface User {
    name: string | null;
    email: string | null;
    image: string | null;
}

export interface SessionState {
    data: User | null;
    status: SessionStatus;
}

export interface Session extends SessionState {
    login: (token: string) => void;
    logout: () => void;
}
