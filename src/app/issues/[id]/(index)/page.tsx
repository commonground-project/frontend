"use client";

import IssueCard from "@/components/Conversation/Issues/IssueCard";
import ViewpointList from "@/components/Conversation/Viewpoints/ViewpointList";
import { useParams, useRouter } from "next/navigation";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { getIssue } from "@/lib/requests/issues/getIssue";
import AddViewpointBar from "@/components/Conversation/Viewpoints/AddViewpointBar";
import Header from "@/components/AppShell/Header";
import Footer from "@/components/AppShell/Footer";

export default function IssueView() {
    const router = useRouter();
    const params = useParams();
    const [cookies] = useCookies(["auth_token"]);

    const issueId = params.id as string;

    const { data: issue } = useQuery({
        queryKey: ["issue", issueId],
        queryFn: () =>
            getIssue({
                issueId,
                auth_token: cookies.auth_token,
            }),
    });

    return (
        <>
            <Header />
            <div className="scrollbar-gutter-stable-both-edges h-full overflow-y-auto pt-14">
                <div className="flex flex-grow flex-col items-center p-8 pb-16">
                    <div className="mb-6 w-full max-w-3xl">
                        {issue && <IssueCard issue={issue} />}
                    </div>
                    <div className="w-full max-w-3xl">
                        {issue && (
                            <ViewpointList
                                issueId={issueId}
                                viewpointCount={issue.viewpointCount}
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="hidden md:block">
                <AddViewpointBar id={issueId} />
            </div>
            <div className="fixed bottom-0 block w-full md:hidden">
                <Footer
                    pencilIconOnClick={() =>
                        router.push(`/issues/${issueId}/author`)
                    }
                />
            </div>
        </>
    );
}
