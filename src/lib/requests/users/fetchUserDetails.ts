import { generateRequestHeaders } from "../generateRequestHeaders";
import { parseJsonWhileHandlingErrors } from "../transformers";

export type getUserDetailsResponse = {
    username: string;
    nickname: string;
};

type getUserDetailsParams = {
    username: string;
    auth_token?: string;
};

export async function getUserDetails({
    username,
    auth_token,
}: getUserDetailsParams): Promise<getUserDetailsResponse> {
    return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/username/${username}`,
        {
            method: "GET",
            headers: generateRequestHeaders(auth_token),
        },
    ).then(parseJsonWhileHandlingErrors);
}
