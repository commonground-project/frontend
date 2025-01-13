import AddCommentBar from "@/components/Conversation/Comments/AddCommentBar";
import FullViewpointCard from "@/components/Conversation/Comments/FullViewpointCard";
import CommentList from "@/components/Conversation/Comments/CommentList";
import {
    mockEmptyIssue,
    mockIssue,
    mockViewPoint1,
    mockViewPoint2,
} from "@/mock/conversationMock";
import type { Metadata } from "next";

type IssueViewProps = {
    params: Promise<{ id: string; viewpointId: string }>;
};

type MetadataProps = {
    params: Promise<{ viewpointId: string }>;
};

export async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const viewpointId = (await params).viewpointId;
    const viewpoint = viewpointId == "1" ? mockViewPoint1 : mockViewPoint2;

    return {
        title: `CommonGround`,
        keywords: "social-issues, viewpoints, rational-discussion viewpoint",
        description: viewpoint.title,
    };
}

export default async function IssueView({ params }: IssueViewProps) {
    const issueId = (await params).id;
    const issue = issueId == "1" ? mockIssue : mockEmptyIssue;

    const viewpointId = (await params).viewpointId;
    const viewpoint = viewpointId == "1" ? mockViewPoint1 : mockViewPoint2;

    return (
        <div>
            <main className="flex flex-grow flex-col items-center p-8 pb-16">
                <FullViewpointCard
                    issueTitle={issue.title}
                    viewpoint={viewpoint}
                />
                <CommentList viewpointId={viewpointId} />
            </main>
            <AddCommentBar viewpointId={viewpointId} />
        </div>
    );
}
