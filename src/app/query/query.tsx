"use client";

import { useQuery } from "@tanstack/react-query";

export default function Example() {
    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ["repoData"],
        queryFn: async () => {
            const response = await fetch(
                "https://api.github.com/repos/TanStack/query",
            );
            return await response.json();
        },
    });

    if (isPending) return "Loading...";

    if (error) return "An error has occurred: " + error.message;

    return (
        <div className="rounded bg-gray-800 p-4 shadow-md">
            <h1 className="mb-2 text-2xl font-bold text-white">
                {data.full_name}
            </h1>
            <p className="mb-4 text-gray-300">{data.description}</p>
            <div className="flex space-x-4">
                <div className="flex items-center space-x-1">
                    <span className="text-lg text-white">👀</span>
                    <span className="text-lg font-semibold text-white">
                        {data.subscribers_count}
                    </span>
                </div>
                <div className="flex items-center space-x-1">
                    <span className="text-lg text-white">✨</span>
                    <span className="text-lg font-semibold text-white">
                        {data.stargazers_count}
                    </span>
                </div>
                <div className="flex items-center space-x-1">
                    <span className="text-lg text-white">🍴</span>
                    <span className="text-lg font-semibold text-white">
                        {data.forks_count}
                    </span>
                </div>
            </div>
            <div className="mt-4 text-gray-500">
                {isFetching ? "Updating..." : ""}
            </div>
        </div>
    );
}
