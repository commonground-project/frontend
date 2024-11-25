import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { TextInput, Textarea } from "@mantine/core";

export default function ViewpointCard() {
    return (
        <div className="flex h-[calc(100vh-56px-69px-32px)] flex-col gap-2 overflow-auto rounded-lg bg-neutral-100 px-7 py-4">
            <h1 className="text-lg font-semibold text-neutral-700">觀點</h1>
            <TextInput
                variant="unstyled"
                radius={0}
                placeholder="用一句話簡述你的觀點"
                style={{ width: "100%" }}
                classNames={{
                    input: "border-none bg-transparent text-2xl font-semibold text-neutral-700 placeholder:text-neutral-500 focus:outline-none",
                }}
            />
            <Textarea
                variant="unstyled"
                radius={0}
                h="100%"
                w="100%"
                placeholder="開始打字，或選取一段文字來新增引注資料"
                classNames={{
                    wrapper: "h-full",
                    input: "h-full min-h-7 w-full resize-none bg-transparent text-lg font-normal text-neutral-700 placeholder:text-neutral-500 focus:outline-none",
                }}
            />
            <div className="flex justify-end gap-3">
                <button className="flex h-8 w-[76px] items-center justify-center gap-1 rounded-[4px] border-[1px] border-neutral-600 stroke-neutral-600 text-sm font-normal text-neutral-600">
                    <TrashIcon className="inline-block h-5 w-5" />
                    刪除
                </button>
                <button className="flex h-8 w-[76px] items-center justify-center gap-1 rounded-[4px] border-[1px] border-blue-600 bg-blue-600 text-sm font-normal text-white">
                    <PlusIcon className="inline-block h-5 w-5" />
                    發表
                </button>
            </div>
        </div>
    );
}
