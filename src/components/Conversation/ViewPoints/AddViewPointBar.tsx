import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type AddViewPointBarProps = {
    id: string;
};

export default function AddViewPointBar({ id }: AddViewPointBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center px-8 pb-3">
            <Link
                href={`/issues/${id}/author`}
                className="left-4 z-20 flex w-full max-w-3xl items-center rounded-full border-[1px] border-zinc-500 bg-neutral-50 py-2"
            >
                <PlusIcon className="ml-[21px] inline size-6 fill-none stroke-neutral-500 stroke-[1.5] duration-300 hover:stroke-emerald-500" />
                <h1 className="ml-1 inline text-base font-bold text-neutral-500">
                    想講點什麼嗎?
                </h1>
            </Link>
        </div>
    );
}
