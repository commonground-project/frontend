import { ViewPoint } from "@/types/conversations.types";
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    ArrowUpCircleIcon,
} from "@heroicons/react/24/solid";

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
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 stroke-neutral-600 hover:stroke-green-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                            />
                        </svg>
                    </button>
                    <h1 className="w-11 px-1 text-neutral-600">
                        {viewpoint.thumbsup}
                    </h1>
                    {/* arrowup */}
                    <button>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 stroke-neutral-600 hover:stroke-green-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                    </button>
                    <h1 className="w-11 px-1 text-neutral-600">
                        {viewpoint.thumbsdown}
                    </h1>
                    {/* thumbsdown */}
                    <button>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 stroke-neutral-600 hover:stroke-green-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                            />
                        </svg>
                    </button>
                    <h1 className="w-11 px-1 text-neutral-600">
                        {viewpoint.thumbsdown}
                    </h1>
                </div>
            </div>
            {/* fact */}
            <div className="relative float-right h-52 w-3/12 overflow-auto px-1">
                <h1 className="my-2 text-xs font-normal text-black">
                    引注事實
                </h1>
                {/* <div className="absolute top-0 mb-2 h-4 font-normal text-black"></div> */}
                {viewpoint.facts.map((fact, index) => (
                    <div key={fact.id}>
                        <div className="flex">
                            <h1 className="inline-block text-xs font-normal text-black">
                                [{index + 1}]
                            </h1>
                            <div className="inline-block px-1">
                                <h1 className="text-xs font-normal text-black">
                                    {fact.title}
                                </h1>
                                {/* sources */}

                                {fact.sources.map((source) => (
                                    <div
                                        key={source.id}
                                        className="flex items-center"
                                    >
                                        <img
                                            className="inline-block h-3 w-3 rounded-full"
                                            src={source.icon}
                                        />
                                        <h1 className="inline-block pl-1 font-sans text-xs font-normal text-neutral-500">
                                            {source.website}
                                        </h1>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {index !== viewpoint.facts.length - 1 && (
                            <hr className="my-1 border-neutral-400" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
