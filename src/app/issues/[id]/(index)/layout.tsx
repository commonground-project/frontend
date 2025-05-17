import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getIssue } from "@/lib/requests/issues/getIssue";
import type { Issue } from "@/types/conversations.types";

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
