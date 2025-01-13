"use client";
import { Avatar } from "@mantine/core";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import { ViewPoint } from "@/types/conversations.types";

type IssueCardProps = {
    issueTitle: string;
    viewpoint: ViewPoint;
};

export default function FullViewpointCard({
    issueTitle,
    viewpoint,
}: IssueCardProps) {
    return (
        <div className="mb-6 w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            <h2 className="text-lg text-neutral-600">觀點・{issueTitle}</h2>
            <h1 className="mt-1 py-1 font-sans text-2xl font-bold">
                {viewpoint.title}
            </h1>
            <div className="mt-2 flex gap-2">
                <Avatar
                    name={viewpoint.user.nickname}
                    src={viewpoint.user.avatar}
                    alt=""
                    size="1.5rem"
                />
                <h1 className="inline-block text-base font-normal text-neutral-600">
                    {viewpoint.user.nickname}
                </h1>
            </div>
            {viewpoint.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mt-3 text-lg font-normal">
                    {paragraph}
                </p>
            ))}
            <div className="flex pt-2">
                {/* like */}
                <button>
                    <HandThumbUpIcon
                        className={`size-6 fill-none stroke-neutral-600 stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">{viewpoint.like}</h1>
                {/* reasonable */}
                <button>
                    <ArrowUpCircleIcon
                        className={`size-6 fill-none stroke-neutral-600 stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">
                    {viewpoint.reasonable}
                </h1>
                {/* dislike */}
                <button>
                    <HandThumbDownIcon
                        className={`size-6 fill-none stroke-neutral-600 stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">
                    {viewpoint.dislike}
                </h1>
            </div>
        </div>
    );
}
