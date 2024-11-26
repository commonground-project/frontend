import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button, TextInput, Textarea } from "@mantine/core";

export default function ViewpointCard() {
    return (
        <div className="flex h-full flex-col gap-2 overflow-auto rounded-lg bg-neutral-100 px-7 py-4">
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
                    input: "h-full min-h-7 w-full resize-none bg-transparent text-lg font-normal text-neutral-700 placeholder:text-neutral-500",
                }}
            />
            <div className="flex justify-end gap-3">
                <Button
                    variant="outline"
                    color="#525252"
                    leftSection={<TrashIcon className="h-5 w-5" />}
                    classNames={{
                        root: "px-0 h-8 w-[76px] text-sm font-normal text-neutral-600",
                        section: "mr-1",
                    }}
                >
                    刪除
                </Button>
                <Button
                    variant="filled"
                    color="#2563eb"
                    leftSection={<PlusIcon className="h-5 w-5" />}
                    classNames={{
                        root: "px-0 h-8 w-[76px] text-sm font-normal text-white",
                        section: "mr-1",
                    }}
                >
                    發表
                </Button>
            </div>
        </div>
    );
}
