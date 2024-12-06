export const COOKIE_AUTH_NAME = "Session";
export const COOKIE_OPTIONS = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
};
