import Header from "@/components/AppShell/Header";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <div className="scrollbar-gutter-stable-both-edges overflow-y- h-[calc(100vh-56px)] pt-14">
                {children}
            </div>
        </>
    );
}
