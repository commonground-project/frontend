import { PlusIcon } from "@heroicons/react/24/outline";

export default function EmptyReplyCard() {
    return (
        <div>
            <h1 className="text-center text-lg font-semibold text-neutral-500">
                目前還沒有人發表回覆
            </h1>
            <h1 className="mb-2 text-center text-lg font-semibold text-neutral-500">
                想發表對這個觀點的看法嗎？
            </h1>
            <div className="flex items-center justify-center gap-1">
                <PlusIcon className="h-6 w-6 stroke-emerald-600 stroke-[1.5]" />
                <h1 className="text-lg font-semibold text-emerald-600">
                    想講點什麼嗎？
                </h1>
            </div>
        </div>
    );
}
