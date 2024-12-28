import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshJwtRequest } from "./lib/requests/auth/refreshJwt";
import { decodeToken } from "react-jwt";
import { DecodedToken } from "./types/users.types";

export async function middleware(request: NextRequest) {
    const userToken = request.cookies.get("auth_token");
    const userRefreshToken = request.cookies.get("auth_refresh_token");

    if (!userToken && userRefreshToken) {
        const apiResponse = await refreshJwtRequest(userRefreshToken.value);
        const mdwResponse = NextResponse.next();

        const newToken = decodeToken<DecodedToken>(apiResponse.accessToken);

        if (!newToken) {
            mdwResponse.cookies.set("auth_token", "", {
                expires: new Date(0),
                path: "/",
            });
            mdwResponse.cookies.set("auth_refresh_token", "", {
                expires: new Date(0),
                path: "/",
            });
        } else {
            mdwResponse.cookies.set("auth_token", apiResponse.accessToken, {
                expires: new Date(newToken.exp * 1000),
                path: "/",
            });
            mdwResponse.cookies.set(
                "auth_refresh_token",
                apiResponse.refreshToken,
                {
                    expires: new Date(apiResponse.expirationTime),
                    path: "/",
                },
            );
        }

        return mdwResponse;
    }
}
