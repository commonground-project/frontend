"use client";

import { AuthContext } from "@/lib/auth/authContext";
import { useContext, useEffect } from "react";

export default function useAuth() {
    const { user, login, logout } = useContext(AuthContext);

    useEffect(() => {
        console.warn(
            "useAuth is deprecated, migrate to using AuthContext directly",
        );
    }, []);

    return {
        user,
        login,
        logout,
    };
}
