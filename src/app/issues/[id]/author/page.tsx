import ViewpointCard from "@/components/AuthorViewpoint/ViewpointCard";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import FactListCard from "@/components/AuthorViewpoint/FactListCard";
import { Metadata } from "next";

type AuthorViewPointProps = {
    params: {
        id: string;
    };
};

export const metadata: Metadata = {
    title: "CommonGround - 撰寫觀點",
    keywords: "社會時事, 觀點, 理性討論, 撰寫觀點",
};

export default function AuthorViewPoint({ params }: AuthorViewPointProps) {
    const id = params.id;

    return (
        <main className="mx-auto my-8 w-full max-w-7xl">
            <Link
                href={`/issues/${id}`}
                className="mb-2 ml-7 flex w-[100px] items-center text-lg font-semibold text-neutral-500 duration-300 hover:text-emerald-500"
            >
                <ArrowLongLeftIcon className="mr-1 inline-block h-6 w-6" />
                返回議題
            </Link>
            <div className="flex h-[calc(100hv-157px)] w-full items-stretch gap-7">
                {/* 157px = 56px(header) + 69px(margin-top between header and this div) + 32px(padding-bottom of main)*/}
                <div className="w-2/3">
                    <ViewpointCard />
                </div>
                <div className="w-1/3">
                    <FactListCard />
                </div>
            </div>
        </main>
    );
}
