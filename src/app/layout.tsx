import { MantineProvider } from "@mantine/core";
import Header from "../components/AppShell/Header";
import "@mantine/core/styles.css";
import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="pt-14 antialiased">
                <div className="fixed inset-0 z-0 bg-neutral-200" />
                <Header />
                <MantineProvider
                    defaultColorScheme="light"
                    theme={{
                        fontFamily: "var(--font-geist-sans)", // Use Geist Sans as the default font
                        fontFamilyMonospace: "var(--font-geist-mono)", // Use Geist Mono for monospace text
                        headings: { fontFamily: "var(--font-geist-sans)" }, // Use Geist Sans for headings
                    }}
                >
                    <div className="relative z-10">{children}</div>
                </MantineProvider>
            </body>
        </html>
    );
}
