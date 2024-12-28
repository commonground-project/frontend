import AddViewPointBar from "@/components/Conversation/ViewPoints/AddViewPointBar";
import IssueCard from "@/components/Conversation/Issues/IssueCard";
import ViewPointList from "@/components/Conversation/ViewPoints/ViewPointList";
import type { Metadata } from "next";
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
    const issue: Issue = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.TMP_JWT_TOKEN}`,
            },
        },
    ).then((res) => res.json());
    return {
        title: `CommonGround - ${issue.title}`,
        keywords: "social-issues, viewpoints, rational-discussion",
        description: issue.description,
    };
}

export default async function IssueView({ params }: IssueViewProps) {
    const issueId = (await params).id;

    const issue: Issue = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMP_JWT_TOKEN}`,
            },
        },
    ).then((res) => res.json());

    return issue ? (
        <div>
            <main className="flex flex-grow flex-col items-center p-8 pb-16">
                <IssueCard issue={issue} />
                <ViewPointList issueId={issueId} />
            </main>
            <AddViewPointBar id={issueId} />
        </div>
    ) : (
        <div>Loading...</div>
    );
}
