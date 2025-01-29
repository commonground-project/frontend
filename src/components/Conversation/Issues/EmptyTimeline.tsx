import { ArrowDownIcon } from "@heroicons/react/24/outline";

export default function EmptyTimeline() {
    return (
        <div className="flex w-full">
            <div className="relative ml-8 mt-4">
                <div className="absolute left-[7.5px] top-[-14px] h-[16px] w-[1.5px] bg-black"></div>
                <ArrowDownIcon className="size-4 stroke-[2px] text-black" />
            </div>
            <h1 className="ml-7 font-black">
                目前議題的資料還不足以產生時間軸，稍後再回來看看吧!
            </h1>
        </div>
    );
}
