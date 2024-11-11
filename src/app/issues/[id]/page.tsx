import AddViewPointBar from "@/components/Conversation/ViewPoints/AddViewPointBar";
import IssueCard from "@/components/Conversation/Issues/IssueCard";
import Meta from "@/components/AppShell/Meta";
import {
    mockIssue,
    mockViewPointList,
    mockEmptyIssue,
} from "@/mock/conversationMock";
import ViewPointList from "@/components/Conversation/ViewPoints/ViewPointList";

type IssueViewProps = {
    params: {
        id: string;
    };
};

export default function IssueView({ params }: IssueViewProps) {
    const { id } = params;
    console.log(id);
    const issue = id == "1" ? mockIssue : mockEmptyIssue;
    const viewpoints = id == "1" ? mockViewPointList : [];
    return (
        <div>
            <Meta
                title={issue.title}
                keywords="social-issues, viewpoints, rational-discussion"
                description={issue.summary}
            />
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
