import type { Metadata } from "next";
import { MantineProvider } from "@mantine/core";
import localFont from "next/font/local";
import Header from "../components/AppShell/Header";
import "@mantine/core/styles.css";
import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} pt-14 antialiased`}
            >
                <Header />
                <MantineProvider
                    defaultColorScheme="light"
                    theme={{
                        fontFamily: "var(--font-geist-sans)", // Use Geist Sans as the default font
                        fontFamilyMonospace: "var(--font-geist-mono)", // Use Geist Mono for monospace text
                        headings: { fontFamily: "var(--font-geist-sans)" }, // Use Geist Sans for headings
                    }}
                >
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
}
