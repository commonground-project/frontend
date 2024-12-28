import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshJwtRequest } from "./lib/requests/auth/refreshJwt";
import { decodeToken } from "react-jwt";
import { DecodedToken } from "./types/users.types";

export async function middleware(request: NextRequest) {
    const userToken = request.cookies.get("auth_token");
    const userRefreshToken = request.cookies.get("auth_refresh_token");

    // console.log("User token: ", userToken?.value);
    // console.log("User refresh token: ", userRefreshToken?.value);

    if (!userToken && userRefreshToken) {
        // console.log("No token found, refreshing token...");

        const apiResponse = await refreshJwtRequest(userRefreshToken.value);
        const mdwResponse = new NextResponse();

        const newToken = decodeToken<DecodedToken>(apiResponse.accessToken);
        // console.log(newToken);

        if (!newToken) {
            mdwResponse.cookies.set("auth_token", "", {
                expires: new Date(0),
            });
            mdwResponse.cookies.set("auth_refresh_token", "", {
                expires: new Date(0),
            });
        } else {
            mdwResponse.cookies.set("auth_token", apiResponse.accessToken, {
                expires: new Date(newToken.exp * 1000),
            });
            mdwResponse.cookies.set(
                "auth_refresh_token",
                apiResponse.refreshToken,
                {
                    expires: new Date(apiResponse.expirationTime),
                },
            );
        }

        return mdwResponse;
    }
}
