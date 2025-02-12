import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getIssueByID } from "@/lib/requests/issues/getIssueById";
import { getViewpointByID } from "@/lib/requests/viewpoints/getViewpointById";
import AuthorReplyBar from "@/components/Conversation/Editors/Replies/AuthorReplyBar";
import ReplyList from "@/components/Conversation/Replies/ReplyList";
import PageDisplayCard from "@/components/Conversation/Viewpoints/PageDisplayCard";
import type { Issue, ViewPoint } from "@/types/conversations.types";

type ViewpointPageProps = {
    params: Promise<{ id: string; vpid: string }>;
};

export async function generateMetadata({ params }: ViewpointPageProps) {
    const pageParams = await params;
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth_token");

    const viewpoint = await getViewpointByID(
        pageParams.vpid,
        auth_token?.value ?? "",
    );
    return {
        title: `CommonGround - ${viewpoint.title}`,
        description: viewpoint.content,
    };
}

export default async function ViewpointPage({ params }: ViewpointPageProps) {
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth_token");
    if (!auth_token) return redirect("/login");

    const pageParams = await params;
    if (!pageParams.id || !pageParams.vpid) return notFound();

    let issue: Issue | null = null;

    try {
        issue = await getIssueByID(pageParams.id, auth_token.value);
    } catch (error: any) {
        if (error.status === 404) return notFound();
        throw error;
    }

    let viewpoint: ViewPoint | null = null;

    try {
        viewpoint = await getViewpointByID(pageParams.vpid, auth_token.value);
    } catch (error: any) {
        if (error.status === 404) return notFound();
        throw error;
    }

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
            <AuthorReplyBar id={viewpoint.id} />
        </div>
    );
}
