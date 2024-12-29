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
                <Providers>
                    <Header />
                    <div className="scrollbar-gutter-stable-both-edges fixed bottom-0 left-0 right-0 top-14 h-[calc(100vh-56px)] overflow-y-auto">
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
