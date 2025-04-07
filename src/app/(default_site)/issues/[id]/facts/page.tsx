import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Issue } from "@/types/conversations.types";
import AllFactsDisplay from "@/components/Conversation/Facts/AllFactsDisplay";
import { getIssueByID } from "@/lib/requests/issues/getIssueById";
import type { Metadata } from "next";

type FactsPageProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({
    params,
}: FactsPageProps): Promise<Metadata> {
    const cookieStore = await cookies();
    const pageId = (await params).id;
    const auth_token = cookieStore.get("auth_token")?.value as string;

    const issue = await getIssueByID(pageId, auth_token);
    return {
        title: `CommonGround - ${issue.title}`,
        description: issue.description,
    };
}

export default async function FactsPage({ params }: FactsPageProps) {
    const cookieStore = await cookies();
    const pageId = (await params).id;
    const auth_token = cookieStore.get("auth_token")?.value as string;

    let issue: Issue | null = null;

    try {
        issue = await getIssueByID(pageId, auth_token);
    } catch (e) {
        console.error(e);
        if (e == "Error: Not found") notFound();
        else return `未知的錯誤發生了：${e}`;
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
