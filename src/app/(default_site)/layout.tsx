import "@mantine/core/styles.css";
import "@/app/globals.css";
import Header from "../../components/AppShell/Header";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
