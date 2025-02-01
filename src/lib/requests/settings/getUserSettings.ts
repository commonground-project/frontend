import type { UserSettings } from "@/types/users.types";
import { parseJsonWhileHandlingErrors } from "../transformers";

export const getUserSettings = async ({
    auth_token,
}: {
    auth_token: string;
}): Promise<UserSettings> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/settings`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    ).then(parseJsonWhileHandlingErrors);
};
