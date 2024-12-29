"use client";

import type { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { CookiesProvider } from "react-cookie";

interface Props {
    children: ReactNode;
}

export default function Providers({ children }: Props) {
    return (
        <MantineProvider>
            <CookiesProvider>{children}</CookiesProvider>
        </MantineProvider>
    );
}
