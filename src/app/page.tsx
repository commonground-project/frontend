import { mockEmptyIssue, mockIssue } from "@/mock/conversationMock";
import HomePageCard from "../components/HomePage/HomePageCard";
import Meta from "@/components/AppShell/Meta";

const issues = [mockIssue, mockEmptyIssue];
const UserName = "Ben";
export default function Page() {
    return (
        <>
            <Meta
                title="CommonGround"
                keywords="CommonGround, issues"
                description="CommonGround is a platform for sharing and discussing viewpoints on various issues."
            />
            <div className="flex min-h-screen flex-col bg-neutral-200">
                <main className="flex flex-grow flex-col items-center p-8">
                    <h1 className="w-full max-w-3xl pb-3 text-2xl font-semibold text-neutral-900">
                        {UserName}, 歡迎來到 CommonGround
                    </h1>
                    <HomePageCard issues={issues} />
                </main>
            </div>
        </>
    );
}
