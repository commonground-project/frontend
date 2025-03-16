"use client";

import { MantineProvider } from "@mantine/core";
import type { ReactNode } from "react";
import {
    isServer,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner";
import { CommonGroundMantineTheme } from "@/lib/configs/mantine";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { decodeToken } from "react-jwt";
import { Noto_Serif_TC } from "next/font/google";
import type { DecodedToken } from "@/types/users.types";
import AuthProvider from "@/components/Auth/AuthProvider";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // Set to >0 to avoid immediate re-fetching on client considering we're using SSR
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (isServer) {
        return makeQueryClient(); // Server: always make a new query client
    } else {
        // Browser: make a new query client if we don't already have one
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "", {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        loaded: (ph) => {
            // Connect PostHog to the user's identity if they're logged in
            const userToken = document.cookie
                .split(";")
                .map((x) => x.trim().split("="))
                .find((c) => c[0] == "auth_token")?.[1];
            const user = decodeToken<DecodedToken>(userToken ?? "");
            if (user) {
                ph.identify(user.sub, {
                    email: user.email,
                    username: user.username,
                });
            }
        },
    });
}

const notoSerifTC = Noto_Serif_TC({
    subsets: ["latin"], // Use 'chinese-traditional' if available in future
    display: "swap",
});

type ProviderProps = {
    children: ReactNode;
};

export default function Providers({ children }: ProviderProps) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <PostHogProvider client={posthog}>
                    <MantineProvider theme={CommonGroundMantineTheme}>
                        {children}
                    </MantineProvider>
                    <Toaster richColors />
                </PostHogProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
