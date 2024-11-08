import { ViewPoint } from "@/types/conversations.types";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";
import FactCard from "./FactCard";

type ViewPointBlockProps = {
    viewpoint: ViewPoint;
};

export default function ViewPointBlock({ viewpoint }: ViewPointBlockProps) {
    return (
        <div>
            {/* content */}
            <div className="relative float-left h-52 w-9/12">
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
                {/* thumbsup */}
                <div className="absolute bottom-0 flex">
                    {/* thumbsup */}
                    <button>
                        <HandThumbUpIcon className="size-6 fill-none stroke-neutral-600 stroke-[1.5] hover:stroke-green-400" />
                    </button>
                    <h1 className="w-11 px-1 text-neutral-600">
                        {viewpoint.thumbsup}
                    </h1>
                    {/* arrowup */}
                    <button>
                        <ArrowUpCircleIcon className="size-6 fill-none stroke-neutral-600 stroke-[1.5] hover:stroke-green-400" />
                    </button>
                    <h1 className="w-11 px-1 text-neutral-600">
                        {viewpoint.thumbsdown}
                    </h1>
                    {/* thumbsdown */}
                    <button>
                        <HandThumbDownIcon className="size-6 fill-none stroke-neutral-600 stroke-[1.5] hover:stroke-green-400" />
                    </button>
                    <h1 className="w-11 px-1 text-neutral-600">
                        {viewpoint.thumbsdown}
                    </h1>
                </div>
            </div>
            {/* fact */}
            <h1 className="float-right my-2 w-3/12 text-xs font-normal text-black">
                引注事實
            </h1>
            <div className="relative float-right h-52 w-3/12 overflow-auto px-1">
                {/* <div className="absolute top-0 mb-2 h-4 font-normal text-black"></div> */}
                {viewpoint.facts.map((fact, index) => (
                    <div key={fact.id}>
                        <FactCard fact={fact} factindex={index} />
                        {index !== viewpoint.facts.length - 1 && (
                            <hr className="my-1 border-neutral-400" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
