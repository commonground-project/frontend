import type { UserRoles } from "@/types/users.types";
import { parseJsonWhileHandlingErrors } from "../transformers";

export type SetupUserParams = {
    username: string;
    nickname: string;
    occupation: string;
    gender: string;
    birthDate: string;
};

export type SetupUserResponse = {
    username: string;
    nickname: string;
    email: string;
    role: UserRoles;
    occupation: string;
    gender: string;
    birthdate: number;
};

export const setupUserRequest = async (
    payload: SetupUserParams,
    auth_token: string,
): Promise<SetupUserResponse> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/setup`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify(payload),
        },
    ).then(parseJsonWhileHandlingErrors);
};
