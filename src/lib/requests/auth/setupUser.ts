import type { UserRoles } from "@/types/users.types";
import { parseJsonWhileHandlingErrors } from "../middlewares";

export type SetupUserRequestedFields = {
    username: string;
    nickname: string;
};

export type SetupUserResponse = {
    username: string;
    nickname: string;
    email: string;
    role: UserRoles;
};

export const setupUserRequest = async (
    payload: SetupUserRequestedFields,
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
