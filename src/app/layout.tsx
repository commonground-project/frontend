<<<<<<< HEAD
import type { Metadata } from "next";
import Providers from "@/components/Providers";
import localFont from "next/font/local";
=======
import { MantineProvider } from "@mantine/core";
import Header from "../components/AppShell/Header";
>>>>>>> 944830c991c7227eebc1c48c11f360982b350967
import "@mantine/core/styles.css";
import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
<<<<<<< HEAD
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <Providers>{children}</Providers>
=======
            <body className="fixed inset-0 bg-neutral-200 pt-14 antialiased">
                <MantineProvider>
                    <Header />
                    <div className="h-[calc(100vh-56px)] overflow-y-auto">
                        {children}
                    </div>
                </MantineProvider>
>>>>>>> 944830c991c7227eebc1c48c11f360982b350967
            </body>
        </html>
    );
}
