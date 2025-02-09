import Header from "@/components/AppShell/Header";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <div className="scrollbar-gutter-stable-both-edges h-[calc(100vh-56px)] overflow-y-auto">
                {children}
            </div>
        </>
    );
}
