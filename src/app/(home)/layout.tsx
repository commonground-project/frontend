import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CommonGround",
    description: "A platform for people to discuss and share their opinions.",
};

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}