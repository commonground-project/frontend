"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Error({
    error: __error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-red-200 p-2">
            <ExclamationTriangleIcon className="size-32 text-red-500" />
            <div className="text-4xl font-bold text-red-500">Error</div>
            <div className="font-medium text-red-500">
                請嘗試
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="underline decoration-solid decoration-2"
                >
                    重新整理頁面
                </button>
            </div>
            <div className="font-medium text-red-500">
                若錯誤持續發生，請
                <Link
                    href="mailto:contact@commonground.tw"
                    className="inline underline decoration-solid decoration-2"
                >
                    聯繫我們
                </Link>
            </div>
        </div>
    );
}
