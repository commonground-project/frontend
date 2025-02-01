import { UserSettings } from "@/types/users.types";
import { parseJsonWhileHandlingErrors } from "../transformers";

export const putUserSettings = async ({
    settings,
    auth_token,
}: {
    settings: UserSettings;
    auth_token: string;
}): Promise<void> => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/setting`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`,
        },
        body: JSON.stringify(settings),
    }).then(parseJsonWhileHandlingErrors);
};
