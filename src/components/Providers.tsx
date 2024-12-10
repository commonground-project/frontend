"use client";

import { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { CookiesProvider } from "react-cookie";

interface Props {
    children: ReactNode;
}

export default function Providers({ children }: Props) {
    return (
        <MantineProvider>
            <CookiesProvider
                defaultSetOptions={{
                    path: "/",
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax" as const,
                }}
            >
                {children}
            </CookiesProvider>
        </MantineProvider>
    );
}
