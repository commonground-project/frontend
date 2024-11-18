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
            <body className="fixed inset-0 bg-neutral-200 pt-14 antialiased">
                <MantineProvider>
                    <Header />
                    <div className="h-[calc(100%-3.5rem)] overflow-y-scroll">
                        {children}
                    </div>
                </MantineProvider>
            </body>
        </html>
    );
}
