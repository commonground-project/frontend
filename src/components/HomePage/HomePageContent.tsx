"use client";

import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import HomePageCard from "../../components/HomePage/HomePageCard";
import { getIssues } from "@/lib/requests/issues/getIssues";
import HomePageCardSkeleton from "./HomePageCardSkeleton";
import { useCookies } from "react-cookie";
import withErrorBoundary from "@/lib/utils/withErrorBoundary";

function Page() {
    const [cookies] = useCookies(["auth_token"]);

    const { ref, inView } = useInView();

    const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: ["issues"],
        queryFn: ({ pageParam }) => getIssues(pageParam, cookies.auth_token),
        getNextPageParam: (lastPage) => {
            if (lastPage.page.number < lastPage?.page.totalPage - 1)
                return lastPage.page.number + 1;
            return undefined;
        },
        initialPageParam: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isLoading) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage, isLoading]);

    return (
        <div className="rounded-md bg-neutral-100 px-7 py-6 text-black">
            <div className="flex w-full flex-col gap-2">
                {data &&
                    data.pages.map((page, pageIndex, pages) =>
                        page.content.map((issue, issueIndex, issues) => (
                            <Fragment key={issue.id}>
                                <HomePageCard
                                    issue={issue}
                                    ref={
                                        issueIndex === issues.length - 1 &&
                                        pageIndex === pages.length - 1
                                            ? ref
                                            : undefined
                                    }
                                />
                                {issueIndex !== issues.length - 1 && (
                                    <hr className="my-3 w-full border-b border-b-neutral-500" />
                                )}
                            </Fragment>
                        )),
                    )}
                {isLoading && (
                    <>
                        {data && (
                            <hr className="my-3 w-full border-b border-b-neutral-500" />
                        )}
                        {Array(3)
                            .fill(0)
                            .map((_, index, arr) => (
                                <Fragment key={index}>
                                    <HomePageCardSkeleton />
                                    {index != arr.length - 1 && (
                                        <hr className="my-3 w-full border-b border-b-neutral-500" />
                                    )}
                                </Fragment>
                            ))}
                    </>
                )}
            </div>
        </div>
    );
}

export default withErrorBoundary(Page);
