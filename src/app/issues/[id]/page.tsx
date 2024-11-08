import IssueCard from "@/components/Conversation/IssueCard";
import ViewPointBlock from "@/components/Conversation/ViewPointCard";
import { mockIssue, mockViewPoint } from "@/mock/conversationMock";

type IssueViewProps = {
    params: {
        id: string;
    };
};

export default function IssueView({ params }: IssueViewProps) {
    const { id } = params;
    console.log(id);
    const issue = mockIssue;
    const viewpoints = [mockViewPoint, mockViewPoint, mockViewPoint];
    return (
        <div className="flex min-h-screen flex-col bg-neutral-200">
            <main className="flex flex-grow flex-col items-center p-8">
                {/* issue */}
                <IssueCard issue={mockIssue} />
                {/* view */}
                <div className="w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
                    <h1 className="text-xl font-semibold">查看所有觀點</h1>
                    {viewpoints.map((viewpoint, index) => (
                        <div key={viewpoint.id}>
                            <ViewPointBlock viewpoint={viewpoint} />
                            {index !== viewpoints.length - 1 && (
                                <hr className="my-4 w-full border-neutral-500" />
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
