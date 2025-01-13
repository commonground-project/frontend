import AddReplyBar from "@/components/Conversation/Replies/AddReplyBar";
import ReplyList from "@/components/Conversation/Replies/ReplyList";
import PageDisplayCard from "@/components/Conversation/Viewpoints/PageDisplayCard";
import { mockIssue, mockViewPoint } from "@/mock/conversationMock";
import { notFound } from "next/navigation";

export async function generateMetadata() {
    const viewpoint = mockViewPoint;
    return {
        title: `CommonGround - ${viewpoint.title}`,
        description: viewpoint.content,
    };
}

type ViewpointPageProps = {
    params: Promise<{ id: string; vpid: string }>;
};

export default async function ViewpointPage({ params }: ViewpointPageProps) {
    const pageParams = await params;
    if (!pageParams.id || !pageParams.vpid) return notFound();

    const issue = mockIssue;
    const viewpoint = mockViewPoint;

    return (
        <div>
            <main className="mx-auto w-full max-w-3xl pb-40 pt-8">
                <PageDisplayCard
                    issueId={pageParams.id}
                    issueTitle={issue.title}
                    viewpoint={viewpoint}
                />
                <hr className="h-8" />
                <ReplyList viewpointId={viewpoint.id} />
            </main>
            <AddReplyBar id={viewpoint.id} />
        </div>
    );
}
