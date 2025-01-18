import "@mantine/core/styles.css";
import "@/app/globals.css";
import Providers from "./providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="fixed inset-0 bg-neutral-200 pt-14 antialiased">
                <Providers>
                    <div className="scrollbar-gutter-stable-both-edges h-[calc(100vh-56px)] overflow-y-auto">
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
