import "@mantine/core/styles.css";
import "./globals.css";
import Providers from "./providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="fixed inset-0 bg-neutral-200 pt-14 break-words antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
