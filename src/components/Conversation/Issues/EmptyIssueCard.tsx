"use client";

import { useState } from "react";
import { useCookies } from "react-cookie";
import { useMutation } from "@tanstack/react-query";
import { followIssue } from "@/lib/requests/issues/followIssue";
import {
    PlusIcon,
    NewspaperIcon,
    BookmarkIcon as BookMarkOutline,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as BookMarkSolid } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { Button } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import FactCreationModal from "../Facts/FactCreationModal";

type EmptyIssueCardProps = {
    isFollowing: boolean;
    setIsFollowing: (isFollowing: boolean) => void;
    issueId: string;
};

export default function EmptyIssueCard({
    isFollowing,
    setIsFollowing,
    issueId,
}: EmptyIssueCardProps) {
    const [creationId, setCreationId] = useState<string | null>(null);
    const router = useRouter();

    const [cookies] = useCookies(["auth_token"]);

    const { mutate: follow } = useMutation({
        mutationKey: ["followIssue", issueId],
        mutationFn: () => {
            console.log("followIssue");
            return followIssue({
                issueId: issueId,
                auth_token: cookies.auth_token,
            });
        },
        onSuccess: (data) => {
            setIsFollowing(data.follow);
        },
    });

    return (
        <div>
            <NewspaperIcon className="mx-auto h-40 w-40 stroke-neutral-500 stroke-1" />
            <h1 className="text-center text-lg font-semibold text-neutral-500">
                目前還沒有人新增事實
            </h1>
            <h1 className="mb-2 text-center text-lg font-semibold text-neutral-500">
                想為這個議題補充點什麼嗎?
            </h1>
            <div className="flex items-center gap-1 md:justify-center">
                <Button
                    onClick={() => setCreationId(uuidv4())}
                    className="hidden items-center gap-1 md:flex"
                    variant="transparent"
                >
                    <PlusIcon className="h-6 w-6 stroke-emerald-600 stroke-[1.5]" />
                    <h1 className="text-lg font-semibold text-emerald-600">
                        新增事實
                    </h1>
                </Button>
                <button
                    className="flex h-10 w-1/2 items-center justify-center gap-1 rounded-lg bg-neutral-200 py-2 text-lg font-semibold text-neutral-800 md:hidden"
                    onClick={() => follow()}
                >
                    <PlusIcon className="ml-1 inline-block h-6 w-6" />
                    <div className="text-base font-medium text-neutral-800">
                        引入一則事實
                    </div>
                </button>
                <button
                    className="flex h-10 w-1/2 items-center justify-center gap-1 rounded-lg bg-neutral-200 py-2 text-lg font-semibold text-neutral-800 md:hidden"
                    onClick={() => follow()}
                >
                    {isFollowing ? (
                        <>
                            <BookMarkSolid className="ml-1 inline-block h-6 w-6" />
                            <div className="text-base font-medium text-neutral-800">
                                取消關注
                            </div>
                        </>
                    ) : (
                        <>
                            <BookMarkOutline className="ml-1 inline-block h-6 w-6" />
                            <div>關注議題</div>
                        </>
                    )}
                </button>
            </div>
            <FactCreationModal
                creationID={creationId}
                setCreationID={setCreationId}
                issueId={issueId}
                factCreationCallback={() =>
                    router.push(`/issues/${issueId}/facts`)
                }
            />
        </div>
    );
}
