"use client";

import { useParams } from "next/navigation";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getIssueByID } from "@/lib/requests/issues/getIssueById";
import { getViewpointByID } from "@/lib/requests/viewpoints/getViewpointById";
import AuthorReplyBar from "@/components/Conversation/Editors/Replies/AuthorReplyBar";
import AuthorReplyDrawer from "@/components/Conversation/Editors/Replies/AuthorReplyDrawer";
import ReplyList from "@/components/Conversation/Replies/ReplyList";
import PageDisplayCard from "@/components/Conversation/Viewpoints/PageDisplayCard";
import ReferenceMarkerProvider from "@/components/ReferenceMarker/ReferenceMarkerProvider";
import Header from "@/components/AppShell/Header";
import Footer from "@/components/AppShell/Footer";

export default function ViewpointPage() {
    const [cookie] = useCookies(["auth_token"]);
    const issueId = useParams().id as string;
    const viewpointId = useParams().vpid as string;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { data: issue } = useQuery({
        queryKey: ["issue", issueId],
        queryFn: async () => {
            const issue = await getIssueByID(issueId, cookie.auth_token);
            return issue;
        },
    });

    const { data: viewpoint } = useQuery({
        queryKey: ["viewpoint", viewpointId],
        queryFn: async () => {
            const viewpoint = await getViewpointByID(
                viewpointId,
                cookie.auth_token,
            );
            return viewpoint;
        },
    });

    return (
        <>
            <Header />
            <div className="scrollbar-gutter-stable-both-edges h-full overflow-y-auto pt-14">
                <main className="mx-auto w-full max-w-3xl px-5 pb-40 pt-8">
                    {issue && viewpoint && (
                        <PageDisplayCard
                            issueId={issueId}
                            issueTitle={issue?.title}
                            viewpoint={viewpoint}
                        />
                    )}
                    <hr className="h-8" />
                    {viewpoint && <ReplyList viewpointId={viewpoint.id} />}
                </main>
                <ReferenceMarkerProvider>
                    <div className="fixed bottom-0 left-0 right-0 hidden justify-center pb-3 md:flex">
                        <div className="w-full max-w-3xl">
                            {viewpoint && (
                                <AuthorReplyBar
                                    issueId={issueId}
                                    viewpointId={viewpoint.id}
                                />
                            )}
                        </div>
                    </div>
                    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 md:hidden">
                        <div className="w-full max-w-3xl">
                            {viewpoint && (
                                <AuthorReplyDrawer
                                    isDrawerOpen={isDrawerOpen}
                                    setIsDrawerOpen={setIsDrawerOpen}
                                    viewpointId={viewpoint.id}
                                />
                            )}
                        </div>
                    </div>
                </ReferenceMarkerProvider>
            </div>
            <div className="fixed bottom-0 w-full md:hidden">
                <Footer pencilIconOnClick={() => setIsDrawerOpen(true)} />
            </div>
        </>
    );
}
