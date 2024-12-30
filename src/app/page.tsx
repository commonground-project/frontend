import { cookies } from 'next/headers';
import { decodeUserFromString } from '@/lib/auth/staticDecode';
import HomePageContent from '@/components/HomePage/HomePageContent';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CommonGround",
    description: "A platform for people to discuss and share their opinions.",
};

export default async function Page() {
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth_token")?.value || '';
    const user = decodeUserFromString(auth_token);

    return (
        <main className="flex flex-grow flex-col items-center p-8">
            <h1 className="w-full max-w-3xl pb-3 text-2xl font-semibold text-neutral-900">
                {user?.username}, 歡迎來到 CommonGround
            </h1>

            <HomePageContent authToken={auth_token} />
        </main>
    );
}

