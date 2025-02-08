import { type User } from "@/types/users.types";
import { createContext } from "react";

type LoginFunction = (
    token: string,
    refresh_token: string,
    refresh_token_expiration: number,
) => void;

type AuthContext = {
    user: User | null;
    login: LoginFunction;
    logout: (redirect?: string) => void;
};

export const AuthContext = createContext<AuthContext>({
    user: null,
    login: () => {
        throw new Error("AuthContext hasn't been initialized yet");
    },
    logout: () => {
        throw new Error("AuthContext hasn't been initialized yet");
    },
});
