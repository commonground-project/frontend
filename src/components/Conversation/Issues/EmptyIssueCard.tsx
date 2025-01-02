"use client";

import { useState } from "react";
import { PlusIcon, NewspaperIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Button } from "@mantine/core";
import { v4 as uuidv4 } from "uuid";
import FactCreationModal from "../Facts/FactCreationModal";

type EmptyIssueCardProps = {
    issueId: string;
};

export default function EmptyIssueCard({ issueId }: EmptyIssueCardProps) {
    const [creationId, setCreationId] = useState<string | null>(null);
    const router = useRouter();

    const [openModal, setOpenModal] = useState(false);
    return (
        <div>
            <NewspaperIcon className="mx-auto h-40 w-40 stroke-neutral-500 stroke-1" />
            <h1 className="text-center text-lg font-semibold text-neutral-500">
                目前還沒有人新增事實
            </h1>
            <h1 className="mb-2 text-center text-lg font-semibold text-neutral-500">
                想為這個議題補充點什麼嗎?
            </h1>
            <div className="flex justify-center">
                <Button
                    onClick={() => setCreationId(uuidv4())}
                    className="flex items-center gap-1"
                    variant="transparent"
                >
                    <PlusIcon className="h-6 w-6 stroke-emerald-600 stroke-[1.5]" />
                    <h1 className="text-lg font-semibold text-emerald-600">
                        新增事實
                    </h1>
                </Button>
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
