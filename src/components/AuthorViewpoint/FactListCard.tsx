import { Fact } from "@/types/conversations.types";
import FactCard from "@/components/AuthorViewpoint/FactCard";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

type FactListCardProps = {
    facts: Fact[];
};

export default function FactListCard({ facts }: FactListCardProps) {
    return (
        <div className="h-[calc(100vh-56px-69px-32px)] rounded-lg bg-neutral-100 px-7 py-4">
            <h1 className="mb-1 text-lg font-semibold text-neutral-700">
                事實
            </h1>
            <div className="mb-2 flex w-full items-center py-1 pr-[52px]">
                <MagnifyingGlassIcon className="inline-block h-5 w-5 stroke-neutral-500" />
                <input
                    className="ml-2 w-full bg-transparent text-lg font-normal text-neutral-500 focus:border-b-2 focus:border-b-emerald-500 focus:outline-none"
                    placeholder="搜尋 CommonGround"
                />
            </div>
            <div className="h-[calc(100vh-56px-69px-32px-92px-16px)] overflow-auto">
                <div className="flex flex-col gap-3 pl-7 pr-4">
                    {facts.map((fact) => (
                        <div key={fact.id}>
                            <FactCard fact={fact} />
                        </div>
                    ))}
                </div>
                <div className="mt-2 pl-7">
                    <button className="flex items-center gap-2 text-neutral-600">
                        <PlusIcon className="h-6 w-6" />
                        <h1 className="text-base font-normal">引入一條事實</h1>
                    </button>
                </div>
            </div>
        </div>
    );
}
