import AddViewPointBar from "@/components/Conversation/ViewPoints/AddViewPointBar";
import IssueCard from "@/components/Conversation/Issues/IssueCard";
import ViewPointList from "@/components/Conversation/ViewPoints/ViewPointList";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Issue } from "@/types/conversations.types";

type IssueViewProps = {
    params: Promise<{ id: string }>;
};

type MetadataProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const issueId = (await params).id;
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth_token")?.value || "";

    const issue: Issue = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    ).then((res) => res.json());

    return {
        title: `CommonGround - ${issue.title}`,
        keywords: "social-issues, viewpoints, rational-discussion",
        description: issue.summary,
    };
}

export default async function IssueView({ params }: IssueViewProps) {
    const issueId = (await params).id;
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth_token")?.value || "";

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    ).catch(() => {
        console.log(`HTTP error!`);
        return;
    });

    if (!response?.ok) {
        console.log(`HTTP error! status: ${response?.status}`);
        return <h1> 無法取得議題資訊，請再試一次或是檢查網路連線 </h1>;
    }

    const issue: Issue = await response.json();

    return (
        <div>
            <main className="flex flex-grow flex-col items-center p-8 pb-16">
                <IssueCard issue={issue} />
                <ViewPointList issueId={issueId} />
            </main>
            <AddViewPointBar id={issueId} />
        </div>
    );
}
