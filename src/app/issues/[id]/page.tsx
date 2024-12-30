import AddViewPointBar from "@/components/Conversation/ViewPoints/AddViewPointBar";
import IssueCard from "@/components/Conversation/Issues/IssueCard";
import { mockIssue, mockEmptyIssue } from "@/mock/conversationMock";
import ViewPointList from "@/components/Conversation/ViewPoints/ViewPointList";
import type { Metadata } from "next";

type IssueViewProps = {
    params: Promise<{ id: string }>;
};

type MetadataProps = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const id = (await params).id;
    const issue = id == "1" ? mockIssue : mockEmptyIssue;
    return {
        title: `CommonGround - ${issue.title}`,
        keywords: "social-issues, viewpoints, rational-discussion",
        description: issue.description,
    };
}

export default async function IssueView({ params }: IssueViewProps) {
    const id = (await params).id;
    console.log(id);

    return (
        <div>
            <main className="flex flex-grow flex-col items-center p-8 pb-16">
                <IssueCard issueId={id} />
                <ViewPointList issueId={id} />
            </main>
            <AddViewPointBar id={id} />
        </div>
    );
}
