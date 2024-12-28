"use client";
import { useParams } from "next/navigation";
import ViewpointCard from "@/components/AuthorViewpoint/ViewpointCard";
import FactListCard from "@/components/AuthorViewpoint/FactListCard";
import { useState } from "react";
import { Fact } from "@/types/conversations.types";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function AuthorViewPoint() {
    const params = useParams();
    const issueId = params.id as string;

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

    return (
        <main className="mx-auto my-8 w-full max-w-7xl">
            <Link
                href={`/issues/${issueId}`}
                className="mb-2 ml-7 flex w-[100px] items-center text-lg font-semibold text-neutral-500 duration-300 hover:text-emerald-500"
            >
                <ArrowLongLeftIcon className="mr-1 inline-block h-6 w-6" />
                返回議題
            </Link>
            <div className="flex h-[calc(100hv-157px)] w-full items-stretch gap-7">
                {/* 157px = 56px(header) + 69px(margin-top between header and this div) + 32px(padding-bottom of main)*/}
                <div className="w-2/3">
                    <ViewpointCard
                        issueId={issueId}
                        viewpointTitle={viewpointTitle}
                        setViewpointTitle={setViewpointTitle}
                        setViewpointContent={setViewpointContent}
                        publishViewpoint={publishViewpoint}
                    />
                </div>
                <div className="w-1/3">
                    <FactListCard
                        viewpointFactList={viewpointFactList}
                        setViewpointFactList={setViewpointFactList}
                    />
                </div>
            </div>
        </main>
    );
}
