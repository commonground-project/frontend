import { PlusIcon } from "@heroicons/react/24/outline";

export default function AddViewPointCard() {
    return (
        <div className="fixed bottom-0 flex h-10 w-full flex-grow justify-center px-8 pb-3">
            <div className="relative flex w-full max-w-3xl">
                <input
                    className="absolute w-full rounded-full border-[1px] border-solid border-neutral-500 pl-10 text-base font-normal text-neutral-500"
                    type="text"
                    placeholder="想講點什麼嗎?"
                />
                <button className="absolute left-4 z-20">
                    <PlusIcon className="inline size-6 fill-none stroke-neutral-600 stroke-[1.5] duration-300 hover:stroke-green-300" />
                </button>
            </div>
        </div>
    );
}
