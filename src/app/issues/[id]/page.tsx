import AddViewPointBar from "@/components/Conversation/AddViewPointBar";
import IssueCard from "@/components/Conversation/IssueCard";
import {
    mockIssue,
    mockViewPointList,
    mockEmptyIssue,
} from "@/mock/conversationMock";
import ViewPointList from "@/components/Conversation/ViewPointList";

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
    );
}
