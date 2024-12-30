'use client';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCookies } from "react-cookie";
import HomePageCard from "../../components/HomePage/HomePageCard";
import HomePagePulseCard from '../../components/HomePage/HomePagePulseCard';
import user from '@/hooks/auth/useAuth';

export default function Page() {
    const { ref, inView } = useInView();
    const [ cookies ] = useCookies(["auth_token"]);
    
    const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
        queryKey: ["issues"],
        queryFn: ({ pageParam = 0 }) => {
            return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues?size=10&page=${pageParam}`, {
                headers: {
                    "Authorization": `Bearer ${cookies.auth_token}`,
                }
            })
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
            console.log('Loading next page...'); 
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const issues = data?.pages.flatMap(page => page.content) || [];
    const observerIndex = issues.length - 2;
    console.log('ObserverIndex:', observerIndex);

    return (
        <main className="flex flex-grow flex-col items-center p-8">
            <h1 className="w-full max-w-3xl pb-3 text-2xl font-semibold text-neutral-900">
                {user().user?.username}, 歡迎來到 CommonGround
            </h1>
            {isLoading ? (
                <HomePagePulseCard />
            ) : (
                <HomePageCard 
                    issues={data?.pages.flatMap(page => page.content) || []} 
                    observerRef={ref}
                    observerIndex={observerIndex}
                />
            )}
        </main>
    );
}

