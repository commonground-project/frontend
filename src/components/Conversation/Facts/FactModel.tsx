"use client";

import { useState } from "react";
import { Modal, Button } from "@mantine/core";
import { toast } from "sonner";
import {
    LinkIcon,
    PlusIcon,
    XMarkIcon,
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from "@heroicons/react/24/outline";
import { Fact, FactReference } from "@/types/conversations.types";
import Link from "next/link";

type FactModelProps = {
    opened: boolean;
    onClose: () => void;
    onUpdate?: (updateFact: Fact) => void;
    fact?: Fact;
};

export default function FactModel({
    opened,
    onClose,
    onUpdate,
    fact,
}: FactModelProps) {
    const [url, setUrl] = useState("http://localhost:3000");
    const [tempReferences, setTempReferences] = useState<FactReference[]>([]);
    const [references, setReferences] = useState<FactReference[]>(
        fact?.references?.map((ref) => ({
            ...ref,
            domain: new URL(ref.url).hostname,
        })) || [],
    );

    const addReference = () => {
        try {
            const iframe = document.querySelector("iframe");
            const iframeTitle = iframe?.contentDocument?.title;
            if (iframeTitle) {
                const newReference: FactReference = {
                    id: references.length + tempReferences.length + 1,
                    url: url,
                    icon: "/favicon.ico",
                    title: iframeTitle || "無標題",
                };
                // setReferences([...references, newReference]);
                setTempReferences([...tempReferences, newReference]);
                console.log("New Reference:", newReference);
                toast.success("已暫時新增引述資料至右側");
            }
        } catch (error) {
            toast.error(String(error));
        }
    };

    const removeReference = (id: number) => {
        setReferences(references.filter((ref) => ref.id !== id));
        setTempReferences(tempReferences.filter((ref) => ref.id !== id));
    };

    const createFacts = () => {
        if (!fact || !onUpdate) {
            toast.error("無法更新事實");
            return;
        }

        onUpdate({
            ...fact,
            references: [...references, ...tempReferences],
        });

        setReferences((prev) => [...prev, ...tempReferences]);
        setTempReferences([]);

        toast.success("成功新增引述資料");
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="70rem"
            centered
            withCloseButton={false}
        >
            {/* Modal Header */}
            <div className="flex justify-between pl-2 pt-2">
                <button
                    onClick={onClose}
                    className="flex items-center font-sans text-lg font-bold text-gray-500 hover:text-gray-800"
                >
                    <ArrowLongLeftIcon className="mr-1 h-5 w-5" />
                    返回所有事實
                </button>
            </div>

            {/* Modal Content */}
            <div className="flex h-[calc(100%-60px)] font-sans">
                <div className="w-2/3 p-2">
                    <h1 className="mb-4 text-2xl font-bold text-gray-500">
                        用一句話簡述這個事實
                    </h1>
                    <div className="flex w-full items-center rounded-full border border-gray-200 px-3 py-0.5 shadow-sm">
                        <LinkIcon className="mr-2 h-4 w-4 text-black" />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.google.com"
                            className="flex-1 border-none bg-transparent outline-none placeholder:text-gray-500"
                        />
                        <button
                            className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-gray-500 transition-colors hover:text-gray-800"
                            onClick={addReference}
                        >
                            <span>新增至引述資料</span>
                            <ArrowLongRightIcon className="h-4 w-4" />
                        </button>
                    </div>
                    {/* Preview */}
                    <div className="mt-2 flex h-[calc(60vh-75px)] overflow-hidden rounded-lg border border-gray-200">
                        <iframe
                            src={url}
                            className="h-full w-full"
                            title="網頁預覽"
                        />
                    </div>
                </div>
                {/* Right Side - References */}
                <div className="relative flex w-1/3 flex-col p-2">
                    <h2 className="mb-2 text-lg font-bold">引註資料</h2>

                    <div className="max-h-[530px] space-y-3 overflow-y-auto pr-2">
                        {[...references, ...tempReferences].map((reference) => (
                            <div
                                key={reference.id}
                                className="group flex flex-col items-start justify-between rounded-lg p-2 hover:bg-gray-50"
                            >
                                <div className="flex w-full items-start justify-between">
                                    <Link
                                        href={reference.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 rounded-full bg-gray-200/50 px-3 py-1"
                                    >
                                        <img
                                            src={reference.icon}
                                            alt="website icon"
                                            className="h-4 w-4 rounded-full"
                                        />
                                        <div className="flex items-center gap-x-2">
                                            <div className="text-xs text-gray-500">
                                                {
                                                    new URL(reference.url)
                                                        .hostname
                                                }
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() =>
                                            removeReference(reference.id)
                                        }
                                        className="opacity-0 transition-opacity group-hover:opacity-100"
                                    >
                                        <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    </button>
                                </div>
                                <div className="ml-1 mt-2 text-lg text-gray-800">
                                    {reference.title}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-2 flex justify-end">
                        <Button
                            onClick={createFacts}
                            className="flex items-center rounded-md bg-blue-600 px-2 py-1 text-white hover:bg-blue-800"
                        >
                            <PlusIcon className="mr-1 h-4 w-4" />
                            建立
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
