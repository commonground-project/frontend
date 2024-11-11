import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type AddViewPointBarProps = {
    id: string;
};

export default function AddViewPointBar({ id }: AddViewPointBarProps) {
    console.log(`Try to add Viewpoint on issue ${id}`);
    return (
        <div className="fixed bottom-0 flex h-10 w-full flex-grow justify-center px-8 pb-3">
            <div className="relative flex w-full max-w-3xl">
                <input
                    className="absolute w-full rounded-full border-[1px] border-solid border-neutral-500 pl-10 text-base font-normal text-neutral-500"
                    type="text"
                    placeholder="想講點什麼嗎?"
                />
                <Link
                    href=""
                    className="absolute left-4 z-20 flex justify-center"
                >
                    <PlusIcon className="inline size-6 fill-none stroke-neutral-500 stroke-[1.5] duration-300 hover:stroke-emerald-500" />
                </Link>
            </div>
        </div>
    );
}
