"use client";

import { AuthContext } from "@/lib/auth/authContext";
import { useContext } from "react";

export default function useAuth() {
    const { user, login, logout } = useContext(AuthContext);

    return {
        user,
        login,
        logout,
    };
}
