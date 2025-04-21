import "@mantine/core/styles.css";
import "./globals.css";
// import "@mantine/nprogress/styles.css";
import Providers from "./providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="fixed inset-0 break-words bg-neutral-200 antialiased">
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
