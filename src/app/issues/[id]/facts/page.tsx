import { getIssueByID } from "@/lib/requests/issues/getIssueById";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { Issue } from "@/types/conversations.types";
import AllFactsDisplay from "@/components/Conversation/Facts/AllFactsDisplay";

export default async function FactsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const cookieStore = await cookies();
    const pageId = (await params).id;
    const userToken = cookieStore.get("auth_token")?.value as string;

    if (!userToken) {
        return redirect("/login");
    }

    let issue: Issue | null = null;

    try {
        issue = await getIssueByID(pageId, userToken);
    } catch (e) {
        if (e == "Error: Not found") {
            notFound();
        } else {
            return `未知的錯誤發生了：${e}`;
        }
    }

    if (!issue) return null;

    return (
        <main className="flex flex-grow flex-col items-center p-8 pb-16">
            <div className="mb-6 w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
                <h1 className="py-1 font-sans text-2xl font-bold">
                    {issue.title}
                </h1>

                <AllFactsDisplay issueId={pageId} />
            </div>
        </main>
    );
}
