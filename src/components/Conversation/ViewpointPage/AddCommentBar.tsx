"use client";
import { PlusIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button, Textarea } from "@mantine/core";
import { useState } from "react";

type AddCommentBarProps = {
    viewpointId: string;
};

export default function AddCommentBar({ viewpointId }: AddCommentBarProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");

    const handleBarOnClick = () => {
        console.log(`Add comment on viewpoint ${viewpointId}`);
        setIsEditing(true);
    };

    const handleSendComment = () => {};

    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center px-8 pb-3">
            {isEditing ? (
                <div className="w-full max-w-3xl rounded-md border-[1px] border-neutral-500 bg-neutral-100 px-6 py-3">
                    <Textarea
                        variant="unstyled"
                        autosize
                        value={comment}
                        onChange={(event) =>
                            setComment(event.currentTarget.value)
                        }
                        onClick={handleSendComment}
                        onBlur={() => setIsEditing(false)}
                        classNames={{
                            input: "text-base text-neutral-900 placeholder-neutral-600 p-0",
                        }}
                        placeholder="延續這場討論"
                    />
                    <div className="mt-2 flex w-full justify-end">
                        <Button
                            variant="transparent"
                            classNames={{
                                root: "size-8 p-0",
                            }}
                        >
                            <PaperAirplaneIcon className="size-6 stroke-neutral-500 stroke-1 hover:stroke-emerald-500" />
                        </Button>
                    </div>
                </div>
            ) : (
                <Button
                    onClick={handleBarOnClick}
                    variant="default"
                    classNames={{
                        root: "z-20 flex w-full max-w-3xl items-center rounded-full border-[1px] border-zinc-500 bg-neutral-50 bg-neutral-50 py-2",
                    }}
                >
                    <PlusIcon className="inline size-6 fill-none stroke-neutral-500 stroke-[1.5] duration-300 hover:stroke-emerald-500" />
                    <h1 className="ml-1 inline text-base font-bold text-neutral-500">
                        延續這場討論
                    </h1>
                </Button>
            )}
        </div>
    );
}
