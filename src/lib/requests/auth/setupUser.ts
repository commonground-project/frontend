import type { UserRoles } from "@/types/users.types";

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
    ).then((res) => {
        if (!res.ok) {
            throw new Error(`Error setting up user: ${res.statusText}`);
        }
        return res.json();
    });
};