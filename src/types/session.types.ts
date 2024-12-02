export interface User {
    username: string;
    nickname: string;
    email: string;
    avatar: string;
}

export interface Session {
    data: User | null;
}

export interface Auth {
    login: (token: string) => Promise<User | null>;
    logout: () => Promise<void>;
}
