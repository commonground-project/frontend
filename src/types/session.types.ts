export interface User {
    iss: string;
    sub: string;
    role: string;
    username: string;
    email: string;
    nickname: string;
    jti: number;
    nbf: number;
    exp: number;
}

export interface Session {
    data: User | null;
    login: (token: string) => User | null;
    logout: () => void;
}
