import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { RefreshJwtResponse } from "./lib/requests/auth/refreshJwt";
import { refreshJwtRequest } from "./lib/requests/auth/refreshJwt";
import { decodeToken } from "react-jwt";
import type { DecodedToken } from "./types/users.types";

const protectedPaths = ["/onboarding"];

export async function middleware(request: NextRequest) {
    const userToken = request.cookies.get("auth_token");
    const userRefreshToken = request.cookies.get("auth_refresh_token");
    const requestUrl = new URL(request.url);

    if (!userToken && userRefreshToken) {
        let apiResponse: RefreshJwtResponse | null = null;

        try {
            apiResponse = await refreshJwtRequest(userRefreshToken.value);
        } catch (error) {
            console.error("Error refreshing JWT token", error);
        }

        if (!apiResponse) {
            return NextResponse.next();
        }

        let mdwResponse: NextResponse<unknown> | null = null;

        const newToken = decodeToken<DecodedToken>(apiResponse.accessToken);

        if (!newToken) {
            mdwResponse = NextResponse.next();
            mdwResponse.cookies.set("auth_token", "", {
                expires: new Date(0),
                path: "/",
            });
            mdwResponse.cookies.set("auth_refresh_token", "", {
                expires: new Date(0),
                path: "/",
            });
        } else {
            mdwResponse =
                newToken.role === "ROLE_NOT_SETUP" &&
                requestUrl.pathname !== "/onboarding"
                    ? NextResponse.redirect(new URL("/onboarding", request.url))
                    : NextResponse.next();

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

    const decodedToken = decodeToken<DecodedToken>(userToken?.value ?? "");

    // Rule set: Protected paths
    if (protectedPaths.includes(requestUrl.pathname) && !decodedToken) {
        return NextResponse.redirect(
            new URL(`/login?r=${encodeURI(requestUrl.href)}`, request.url),
        );
    }

    // Rule set: Onbaording
    if (
        decodedToken?.role === "ROLE_NOT_SETUP" &&
        requestUrl.pathname !== "/onboarding"
    ) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (
        decodedToken?.role !== "ROLE_NOT_SETUP" &&
        requestUrl.pathname === "/onboarding"
    ) {
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        {
            source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|serviceWorker.js).*)",
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },

        {
            source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|serviceWorker.js).*)",
            has: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        },

        {
            source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|serviceWorker.js).*)",
            has: [{ type: "header", key: "x-present" }],
            missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
        },
    ],
};
