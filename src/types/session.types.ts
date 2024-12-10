export interface DecodedToken {
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

export interface User {
    role: string;
    username: string;
    email: string;
    nickname: string;
}
