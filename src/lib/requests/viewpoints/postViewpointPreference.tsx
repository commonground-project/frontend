import { parseJsonWhileHandlingErrors } from "../transformers";

export type PostViewpointPreferenceParams = {
    payload: {
        id: string;
        preference: string; // INTEREST | DISINTEREST
    }[];
    auth_token: string;
};

type PostViewpointPreferenceResponse = {
    id: string;
    preference: string; // INTEREST | DISINTEREST
}[];

export const postViewpointPreference = async ({
    payload,
    auth_token,
}: PostViewpointPreferenceParams): Promise<PostViewpointPreferenceResponse> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/viewpoints/preference/me`,
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
