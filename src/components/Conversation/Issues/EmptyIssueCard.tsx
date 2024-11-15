import Link from "next/link";
import { PlusIcon, NewspaperIcon } from "@heroicons/react/24/outline";

type EmptyIssueCardProps = {
    id: number;
};

export default function EmptyIssueCard({ id }: EmptyIssueCardProps) {
    console.log(`EmptyIssueCard id: ${id}`);
    return (
        <div>
            <NewspaperIcon className="mx-auto h-40 w-40 stroke-neutral-500 stroke-1" />
            <h1 className="text-center text-lg font-semibold text-neutral-500">
                目前還沒有人新增事實
            </h1>
            <h1 className="mb-2 text-center text-lg font-semibold text-neutral-500">
                想為這個議題補充點什麼嗎?
            </h1>
            <Link href="">
                <div className="flex items-center justify-center gap-1">
                    <PlusIcon className="h-6 w-6 stroke-emerald-500 stroke-[1.5]" />
                    <h1 className="text-lg font-semibold text-emerald-500">
                        新增事實
                    </h1>
                </div>
            </Link>
        </div>
    );
}
