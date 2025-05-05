import { parseJsonWhileHandlingErrors } from "../transformers";

export type CompleteOnboardingParams = {
    auth_token: string;
};

export type CompleteOnboardingResponse = {
    accessToken: string;
    expirationTime: number;
    refreshToken: string;
};

export const completeOnboardingRequest = async (
    auth_token: string,
): Promise<CompleteOnboardingResponse> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/complete-onboarding/me`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    ).then(parseJsonWhileHandlingErrors);
};
