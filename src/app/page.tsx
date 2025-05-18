import { cookies } from "next/headers";
import { decodeUserFromString } from "@/lib/auth/staticDecode";
import HomePageContent from "@/components/HomePage/HomePageContent";
import Header from "@/components/AppShell/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CommonGround",
};

export default async function HomePage() {
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth_token")?.value || "";
    const user = decodeUserFromString(auth_token);

    return (
        <>
            <Header />
            <div className="scrollbar-gutter-stable-both-edges h-full overflow-y-auto pt-14">
                <main className="flex flex-grow flex-col items-center p-8">
                    <h1 className="w-full max-w-3xl pb-3 text-2xl font-semibold text-neutral-900">
                        {user?.username ?? ""}歡迎來到 CommonGround
                    </h1>
                    <div className="w-full max-w-3xl">
                        <HomePageContent />
                    </div>
                </main>
            </div>
        </>
    );
}
