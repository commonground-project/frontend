<<<<<<< HEAD
import { Suspense } from "react";
import DashboardPage from "@/app/dashboard/page";
=======
import { mockEmptyIssue, mockIssue, mockUser } from "@/mock/conversationMock";
import HomePageCard from "../components/HomePage/HomePageCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CommonGround",
    description: "A platform for people to discuss and share their opinions.",
};
>>>>>>> 944830c991c7227eebc1c48c11f360982b350967

export default function Page() {
    const issues = [mockIssue, mockEmptyIssue];
    const user = mockUser;

    return (
<<<<<<< HEAD
        <div className="flex min-h-screen items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <DashboardPage />
            </Suspense>
=======
        <div className="flex min-h-screen flex-col bg-neutral-200">
            <main className="flex flex-grow flex-col items-center p-8">
                <h1 className="w-full max-w-3xl pb-3 text-2xl font-semibold text-neutral-900">
                    {user.username}, 歡迎來到 CommonGround
                </h1>
                <HomePageCard issues={issues} />
            </main>
>>>>>>> 944830c991c7227eebc1c48c11f360982b350967
        </div>
    );
}
