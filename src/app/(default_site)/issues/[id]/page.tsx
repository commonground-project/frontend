import IssueCard from "@/components/Conversation/Issues/IssueCard";
import ViewpointList from "@/components/Conversation/Viewpoints/ViewpointList";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Issue } from "@/types/conversations.types";
import { getIssue } from "@/lib/requests/issues/getIssue";
import AddViewpointBar from "@/components/Conversation/Viewpoints/AddViewpointBar";

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
        keywords: "社會時事, 觀點, 理性討論",
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
                <div className="mb-6 w-full max-w-3xl">
                    <IssueCard issue={issue} />
                </div>
                <div className="w-full max-w-3xl">
                    <ViewpointList issueId={issueId} />
                </div>
            </main>
            <AddViewpointBar id={issueId} />
        </div>
    );
}
