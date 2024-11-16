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
            <body className="bg-neutral-200 pt-14 antialiased">
                <Header />
                <MantineProvider>{children}</MantineProvider>
            </body>
        </html>
    );
}
