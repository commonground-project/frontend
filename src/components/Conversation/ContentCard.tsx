"use client";
import { useState } from "react";
import { ViewPoint } from "@/types/conversations.types";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
type ContentCardProps = {
    viewpoint: ViewPoint;
};
export default function ContentCard({ viewpoint }: ContentCardProps) {
    const [thumbsup, setThumbsup] = useState(false);
    const [thumbsdown, setThumbsdown] = useState(false);
    const [arrowup, setArrowup] = useState(false);
    const [thumbsupNum, setThumbsupNum] = useState(viewpoint.thumbsup);
    const [thumbsdownNum, setThumbsdownNum] = useState(viewpoint.thumbsdown);
    const [arrowupNum, setArrowupNum] = useState(viewpoint.up);

    function HandleThumbsup() {
        if (thumbsdown === true) {
            setThumbsdown(false);
            setThumbsup(true);
            setThumbsupNum(thumbsupNum + 1);
            setThumbsdownNum(thumbsdownNum - 1);
            return;
        } else if (thumbsup === true) {
            setThumbsup(false);
            setThumbsupNum(thumbsupNum - 1);
            return;
        } else if (thumbsup === false) {
            setThumbsup(true);
            setThumbsupNum(thumbsupNum + 1);
            return;
        }
    }
    function HandleThumbsdown() {
        if (thumbsup === true) {
            setThumbsup(false);
            setThumbsdown(true);
            setThumbsdownNum(thumbsdownNum + 1);
            setThumbsupNum(thumbsupNum - 1);
            return;
        } else if (thumbsdown === true) {
            setThumbsdown(false);
            setThumbsdownNum(thumbsdownNum - 1);
            return;
        } else if (thumbsdown === false) {
            setThumbsdown(true);
            setThumbsdownNum(thumbsdownNum + 1);
            return;
        }
    }
    function HandleArrowup() {
        if (arrowup === true) {
            setArrowup(false);
            setArrowupNum(arrowupNum - 1);
            return;
        } else {
            setArrowup(true);
            setArrowupNum(arrowupNum + 1);
            return;
        }
    }

    console.log(thumbsup);

    return (
        <>
            <img
                className="inline-block h-4 w-4 rounded-full"
                src={viewpoint.user.profile}
                alt="userimage"
            />
            <h1 className="ml-2 inline-block text-xs font-normal text-neutral-600">
                {viewpoint.user.username}
            </h1>
            <h1 className="ml-3 inline-block text-xs font-normal text-neutral-600">
                {viewpoint.created.toLocaleDateString()}
            </h1>
            <h1 className="text-lg font-semibold text-neutral-700">
                {viewpoint.title}
            </h1>
            <p className="text-base font-normal text-black">
                {viewpoint.content}
            </p>
            <div className="flex">
                {/* thumbsup */}
                <button onClick={() => HandleThumbsup()}>
                    <HandThumbUpIcon
                        className={`size-6 fill-none ${thumbsup ? "stroke-green-400" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-green-400`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">{thumbsupNum}</h1>
                {/* arrowup */}
                <button onClick={() => HandleArrowup()}>
                    <ArrowUpCircleIcon
                        className={`size-6 fill-none ${arrowup ? "stroke-green-400" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-green-400`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">{arrowupNum}</h1>
                {/* thumbsdown */}
                <button onClick={() => HandleThumbsdown()}>
                    <HandThumbDownIcon
                        className={`size-6 fill-none ${thumbsdown ? "stroke-green-400" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-green-400`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">{thumbsdownNum}</h1>
            </div>
        </>
    );
}
