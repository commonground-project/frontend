export interface User {
    iss: string;
    sub: string;
    role: string;
    username: string;
    email: string;
    nickname: string;
    jti: string;
    nbf: string;
    exp: string;
}

export interface Session {
    data: User | null;
}

export interface Auth {
    login: (token: string) => User | null;
    logout: () => void;
}
