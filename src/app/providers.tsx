"use client";

import { MantineProvider } from "@mantine/core";
import { ReactNode } from "react";
import {
    isServer,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "sonner";
import { CommonGroundMantineTheme } from "@/lib/configs/mantine";

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

type ProviderProps = {
    children: ReactNode;
};

export default function Providers({ children }: ProviderProps) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider theme={CommonGroundMantineTheme}>
                {children}
            </MantineProvider>
            <Toaster richColors />
        </QueryClientProvider>
    );
}
