import { parseJsonWhileHandlingErrors } from "../transformers";

export type RefreshJwtResponse = {
    accessToken: string;
    refreshToken: string;
    expirationTime: number; // Expiration time for the new refresh token in milliseconds
};

export const refreshJwtRequest = async (
    refresh_token: string,
): Promise<RefreshJwtResponse> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jwt/refresh/${refresh_token}`,
        { cache: "no-cache" },
    ).then(parseJsonWhileHandlingErrors);
};
