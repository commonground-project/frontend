import AddViewPointBar from "@/components/Conversation/ViewPoints/AddViewPointBar";
import IssueCard from "@/components/Conversation/Issues/IssueCard";
import ViewPointList from "@/components/Conversation/ViewPoints/ViewPointList";
import type { Metadata } from "next";
import { Issue } from "@/types/conversations.types";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

type IssueViewProps = {
    issueId: string;
    issue: Issue;
};

type MetadataProps = {
    issue: Issue;
};

export const getServerSideProps = (async (context) => {
    const id = context.params?.id as string;

    const token = process.env.TMP_JWT_TOKEN;

    const issue: Issue = (await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/issues/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    ).then((res) => res.json())) satisfies Issue;

    return {
        props: {
            issueId: id,
            issue,
        },
    };
}) satisfies GetServerSideProps<IssueViewProps>;

// export async function generateMetadata({
//     issue,
// }: MetadataProps): Promise<Metadata> {
//     return {
//         title: `CommonGround - ${issue.title}`,
//         keywords: "social-issues, viewpoints, rational-discussion",
//         description: issue.description,
//     };
// }

export default function IssueView(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
    const { issueId, issue } = props;
    return (
        <div>
            <main className="flex flex-grow flex-col items-center p-8 pb-16">
                <IssueCard issue={issue} />
                <ViewPointList issueId={issueId} />
            </main>
            <AddViewPointBar id={issueId} />
        </div>
    );
}
