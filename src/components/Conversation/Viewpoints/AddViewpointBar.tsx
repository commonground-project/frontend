"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

type AddViewpointBarProps = {
    id: string;
};

export default function AddViewpointBar({ id }: AddViewpointBarProps) {
    const [cookie] = useCookies(["auth_token"]);

    return (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center px-8 pb-3">
            <Link
                href={`/issues/${id}/author`}
                className="left-4 z-20 flex w-full max-w-3xl items-center rounded-full border-[1px] border-zinc-500 bg-neutral-50 py-2"
                onClick={(e) => {
                    if (!cookie.auth_token) {
                        toast.info("登入以發表觀點");
                        e.preventDefault();
                    }
                }}
            >
                <PlusIcon className="ml-[21px] inline size-6 fill-none stroke-neutral-500 stroke-[1.5] duration-300 hover:stroke-emerald-500" />
                <h1 className="ml-1 inline text-base font-bold text-neutral-500">
                    想講點什麼嗎?
                </h1>
            </Link>
        </div>
    );
}
