export const COOKIE_AUTH_NAME = "session_authenticated";
export const COOKIE_OPTIONS = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
};
