import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

type EmptyViewPointCardProps = {
    id: string;
};

export default function EmptyViewPointCard({ id }: EmptyViewPointCardProps) {
    return (
        <>
            <h1 className="text-center text-lg font-semibold text-neutral-500">
                目前還沒有人發表觀點
            </h1>
            <h1 className="text-center text-lg font-semibold text-neutral-500">
                想為這個議題補充點什麼嗎?
            </h1>
            <Link href="" className="item-center flex justify-center pt-2">
                <PlusIcon className="inline h-6 w-6 stroke-emerald-600 stroke-1" />
                <h1 className="inline text-lg font-semibold text-emerald-600">
                    新增事實
                </h1>
            </Link>
        </>
    );
}
