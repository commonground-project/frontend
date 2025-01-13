import { PlusIcon } from "@heroicons/react/24/outline";

type AddReplyBarProps = {
    id: string;
};

export default function AddReplyBar({ id }: AddReplyBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3">
            <div className="z-20 flex w-full max-w-3xl items-center rounded-full border-[1px] border-zinc-500 bg-neutral-50 px-5 py-2">
                <PlusIcon className="inline size-6 fill-none stroke-neutral-500 stroke-[1.5] duration-300 hover:stroke-emerald-500" />
                <h1 className="ml-1 inline text-base font-bold text-neutral-500">
                    延續這場討論
                </h1>
            </div>
        </div>
    );
}
