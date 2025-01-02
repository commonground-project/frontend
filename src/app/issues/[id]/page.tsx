import AddViewpointBar from "@/components/Conversation/Viewpoints/AddViewpointBar";
import IssueCard from "@/components/Conversation/Issues/IssueCard";
import ViewpointList from "@/components/Conversation/Viewpoints/ViewpointList";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Issue } from "@/types/conversations.types";
import { getIssue } from "@/lib/requests/issues/getIssue";

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

    const issue: Issue = await getIssue({ issueId, auth_token });

    return {
        title: `CommonGround - ${issue.title}`,
        keywords: "social-issues, viewpoints, rational-discussion",
        description: issue.description,
    };
}

export default async function IssueView({ params }: IssueViewProps) {
    const issueId = (await params).id;
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth_token")?.value || "";

    const issue: Issue = await getIssue({ issueId, auth_token });

    return (
        <div>
            <main className="flex flex-grow flex-col items-center p-8 pb-16">
                <IssueCard issue={issue} />
                <ViewpointList issueId={issueId} />
            </main>
            <AddViewpointBar id={issueId} />
        </div>
    );
}
