import Header from "@/components/AppShell/Header";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <div className="scrollbar-gutter-stable-both-edges h-full overflow-y-auto pt-14">
                {children}
            </div>
        </>
    );
}
