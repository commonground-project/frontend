import { mockEmptyIssue, mockIssue, mockUser } from "@/mock/conversationMock";
import HomePageCard from "../components/HomePage/HomePageCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CommonGround",
    description: "A platform for people to discuss and share their opinions.",
};

const issues = [mockIssue, mockEmptyIssue];
const user = mockUser;
export default function Page() {
    return (
        <>
            <div className="flex min-h-screen flex-col bg-neutral-200">
                <main className="flex flex-grow flex-col items-center p-8">
                    <h1 className="w-full max-w-3xl pb-3 text-2xl font-semibold text-neutral-900">
                        {user.username}, 歡迎來到 CommonGround
                    </h1>
                    <HomePageCard issues={issues} />
                </main>
            </div>
        </>
    );
}
