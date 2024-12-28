import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CommonGround - 撰寫觀點",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
