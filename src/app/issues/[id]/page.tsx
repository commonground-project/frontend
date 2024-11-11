import AddViewPointBar from "@/components/Conversation/ViewPoints/AddViewPointBar";
import IssueCard from "@/components/Conversation/Issues/IssueCard";
import Meta from "@/components/AppShell/Meta";
import {
    mockIssue,
    mockViewPointList,
    mockEmptyIssue,
} from "@/mock/conversationMock";
import ViewPointList from "@/components/Conversation/ViewPoints/ViewPointList";
import type { Metadata } from "next";
import { title } from "process";

type IssueViewProps = {
    params: {
        id: string;
    };
};
type MetadataProps = {
    params: { id: string };
};

export async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const id = params.id;
    const issue = id == "1" ? mockIssue : mockEmptyIssue;
    const viewpoints = id == "1" ? mockViewPointList : [];
    return {
        title: issue.title,
        keywords: "social-issues, viewpoints, rational-discussion",
        description: issue.summary,
    };
}

export default function IssueView({ params }: IssueViewProps) {
    const { id } = params;
    console.log(id);
    const issue = id == "1" ? mockIssue : mockEmptyIssue;
    const viewpoints = id == "1" ? mockViewPointList : [];
    return (
        <div>
            <div className="flex min-h-screen flex-col bg-neutral-200">
                <main className="flex flex-grow flex-col items-center p-8 pb-12">
                    {/* issue */}
                    <IssueCard issue={issue} />
                    {/* view */}
                    <ViewPointList viewpoints={viewpoints} issueid={id} />
                </main>
                {/* textbar */}
                <AddViewPointBar id={id} />
            </div>
        </div>
    );
}
