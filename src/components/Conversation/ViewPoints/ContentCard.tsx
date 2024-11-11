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
    const [like, setLike] = useState(false);
    const [dislike, setDislike] = useState(false);
    const [reasonable, setReasonable] = useState(false);
    const [likeNum, setLikeNum] = useState(viewpoint.like);
    const [dislikeNum, setDislikeNum] = useState(viewpoint.dislike);
    const [reasonableNum, setReasonableNum] = useState(viewpoint.reasonable);

    function HandleLike() {
        if (dislike === true) {
            setDislike(false);
            setLike(true);
            setLikeNum(likeNum + 1);
            setDislikeNum(dislikeNum - 1);
            return;
        } else if (like === true) {
            setLike(false);
            setLikeNum(likeNum - 1);
            return;
        } else if (like === false) {
            setLike(true);
            setLikeNum(likeNum + 1);
            return;
        }
    }
    function HandleDislike() {
        if (like === true) {
            setLike(false);
            setDislike(true);
            setDislikeNum(dislikeNum + 1);
            setLikeNum(likeNum - 1);
            return;
        } else if (dislike === true) {
            setDislike(false);
            setDislikeNum(dislikeNum - 1);
            return;
        } else if (dislike === false) {
            setDislike(true);
            setDislikeNum(dislikeNum + 1);
            return;
        }
    }
    function HandleReasonable() {
        if (reasonable === true) {
            setReasonable(false);
            setReasonableNum(reasonableNum - 1);
            return;
        } else {
            setReasonable(true);
            setReasonableNum(reasonableNum + 1);
            return;
        }
    }

    console.log(like);

    return (
        <div>
            <img
                className="inline-block h-4 w-4 rounded-full"
                src={viewpoint.user.avatar}
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
            <div className="mt-2 flex">
                {/* like */}
                <button onClick={() => HandleLike()}>
                    <HandThumbUpIcon
                        className={`size-6 fill-none ${like ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">{likeNum}</h1>
                {/* reasonable */}
                <button onClick={() => HandleReasonable()}>
                    <ArrowUpCircleIcon
                        className={`size-6 fill-none ${reasonable ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">{reasonableNum}</h1>
                {/* dislike */}
                <button onClick={() => HandleDislike()}>
                    <HandThumbDownIcon
                        className={`size-6 fill-none ${dislike ? "stroke-emerald-500" : "stroke-neutral-600"} stroke-[1.5] hover:stroke-emerald-500`}
                    />
                </button>
                <h1 className="w-11 px-1 text-neutral-600">{dislikeNum}</h1>
            </div>
        </div>
    );
}
