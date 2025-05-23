import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CommonGround - 登入",
};

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
