import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

type EmptyViewPointCardProps = {
    id: string;
};

export default function EmptyViewPointCard({ id }: EmptyViewPointCardProps) {
    console.log(`EmptyViewPointCard id: ${id}`);
    return (
        <div>
            <h1 className="text-center text-lg font-semibold text-neutral-500">
                目前還沒有人發表觀點
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
