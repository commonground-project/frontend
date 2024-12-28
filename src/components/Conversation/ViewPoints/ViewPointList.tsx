"use client";
import EmptyViewPointCard from "@/components/Conversation/ViewPoints/EmptyViewPointSection";
import ViewPointCard from "@/components/Conversation/ViewPoints/ViewPointCard";
import { useEffect, useState } from "react";
import { ViewPoint } from "@/types/conversations.types";

type ViewPointListProps = {
    issueId: string;
};

export default function ViewPointList({ issueId }: ViewPointListProps) {
    const [viewpoints, setViewpoints] = useState<ViewPoint[]>([]);

    useEffect(() => {
        console.log(`fetching viewpoints ${issueId}`);
        const fetchData = async () => {
            console.log(
                `access token ${process.env.NEXT_PUBLIC_TMP_JWT_TOKEN}`,
            );
            const data = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}/viewpoints?size=10`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMP_JWT_TOKEN}`,
                    },
                },
            ).then((res) => res.json());
            console.log(data);
            setViewpoints(() => data.content);
        };
        fetchData();
    }, [issueId]);

    return (
        <div className="w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            <h1 className="mb-2 text-xl font-semibold">查看所有觀點</h1>
            {viewpoints.length === 0 ? (
                <EmptyViewPointCard id={issueId} />
            ) : (
                <div className="flex-col">
                    {viewpoints.map((viewpoint, index) => (
                        <div key={viewpoint.id}>
                            <ViewPointCard viewpoint={viewpoint} />
                            {index !== viewpoints.length - 1 && (
                                <hr className="my-4 w-full border-neutral-500" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
