import Link from "next/link";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

type EmptyViewpointCardProps = {
    id: string;
};

export default function EmptyViewpointCard({ id }: EmptyViewpointCardProps) {
    return (
        <div>
            <h1 className="text-center text-lg font-semibold text-neutral-500">
                目前還沒有人發表觀點
            </h1>
            <h1 className="mb-4 text-center text-lg font-semibold text-neutral-500 md:mb-2">
                想為這個議題補充點什麼嗎?
            </h1>
            <Link href={`/issues/${id}/author`}>
                <div className="hidden items-center justify-center gap-1 md:flex">
                    <PlusIcon className="h-6 w-6 stroke-emerald-600 stroke-[1.5]" />
                    <h1 className="text-lg font-semibold text-emerald-600">
                        想講點什麼嗎？
                    </h1>
                </div>
                <div className="flex items-center justify-center gap-1 rounded-lg bg-emerald-600 py-2 md:hidden">
                    <PencilSquareIcon className="h-6 w-6 stroke-neutral-50 stroke-[1.5]" />
                    <h1 className="text-lg font-semibold text-neutral-50">
                        發表你的觀點
                    </h1>
                </div>
            </Link>
        </div>
    );
}
