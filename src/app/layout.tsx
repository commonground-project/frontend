import Header from "../components/AppShell/Header";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./globals.css";
import Providers from "./providers";
import Header from "../components/AppShell/Header";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="fixed inset-0 bg-neutral-200 pt-14 antialiased">
                <MantineProvider>
                    <Header />
                    <div className="scrollbar-gutter-stable-both-edges h-[calc(100vh-56px)] overflow-y-auto">
                        {/* 56px for header */}
                        {children}
                    </div>
                </MantineProvider>
            </body>
        </html>
    );
}
