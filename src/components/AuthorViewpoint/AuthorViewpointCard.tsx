"use client";
import ViewpointCard from "@/components/AuthorViewpoint/ViewpointCard";
import FactListCard from "@/components/AuthorViewpoint/FactListCard";
import { useState } from "react";
import { Fact } from "@/types/conversations.types";

type AuthorViewpointCardProps = {
    issueId: string;
};

export default function AuthorViewpointCard({
    issueId,
}: AuthorViewpointCardProps) {
    const [viewpointTitle, setViewpointTitle] = useState<string>("");
    const [viewpointContent, setViewpointContent] = useState<string>("");
    const [viewpointFactList, setViewpointFactList] = useState<Fact[]>([]);

    const publishViewpoint = () => {
        console.log("Publishing viewpoint");
        const viewpoint = {
            Issue: issueId,
            Title: viewpointTitle,
            Content: viewpointContent,
            Facts: viewpointFactList,
        };
        console.log(viewpoint);
    };

    const discardViewpoint = () => {
        console.log("Discard viewpoint");
        setViewpointTitle("");
        setViewpointContent("");
        setViewpointFactList([]);
    };

    return (
        <div className="flex h-[calc(100hv-157px)] w-full items-stretch gap-7">
            {/* 157px = 56px(header) + 69px(margin-top between header and this div) + 32px(padding-bottom of main)*/}
            <div className="w-2/3">
                <ViewpointCard
                    viewpointTitle={viewpointTitle}
                    setViewpointTitle={setViewpointTitle}
                    setViewpointContent={setViewpointContent}
                    publishViewpoint={publishViewpoint}
                    discardViewpoint={discardViewpoint}
                />
            </div>
            <div className="w-1/3">
                <FactListCard
                    viewpointFactList={viewpointFactList}
                    setViewpointFactList={setViewpointFactList}
                />
            </div>
        </div>
    );
}
