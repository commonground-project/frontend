'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import HomePageCard from "../../components/HomePage/HomePageCard";
import HomePagePulseCard from '../../components/HomePage/HomePagePulseCard';

interface HomePageContentProps {
    authToken: string;
}

export default function Page({ authToken }: HomePageContentProps) {
    const { ref, inView } = useInView();
    const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: ["issues"],
        queryFn: ({ pageParam = 0 }) => {
            return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues?size=10&page=${pageParam}`, 
                {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${authToken}`,
                    }
                }
            )
            .then((res) => res.json())
        },
        getNextPageParam: (lastPage) => {
            if (lastPage?.page?.number < lastPage?.page?.totalPage - 1) {
                return lastPage.page.number + 1;
            }
            return undefined;
        },
        initialPageParam: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const issues = data?.pages.flatMap(page => page.content) || [];
    const observerIndex = issues.length - 2;

    return (
        <>
            {isLoading ? (
                <HomePagePulseCard />
            ) : (
                <HomePageCard 
                    issues={data?.pages.flatMap(page => page.content) || []} 
                    observerRef={ref}
                    observerIndex={observerIndex}
                />
            )}
        </>
    );
}

