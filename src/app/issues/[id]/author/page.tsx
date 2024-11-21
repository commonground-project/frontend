import ViewpointCard from "@/components/AuthorViewpoint/ViewpointCard";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";
import FactListCard from "@/components/AuthorViewpoint/FactListCard";
import { mockEmptyIssue, mockIssue } from "@/mock/conversationMock";

type AuthorViewPointProps = {
    params: {
        id: string;
    };
};

export default function AuthorViewPoint({ params }: AuthorViewPointProps) {
    const { id } = params;
    const issue = id == "1" ? mockIssue : mockEmptyIssue;
    return (
        <main className="mx-auto my-8 w-full max-w-7xl">
            {/* <div className="flex w-full flex-col justify-center"> */}
            <Link
                href={`/issues/${id}`}
                className="mb-2 ml-7 flex w-[100px] items-center text-lg font-semibold text-neutral-500 duration-300 hover:text-emerald-500"
            >
                <ArrowLongLeftIcon className="mr-1 inline-block h-6 w-6" />
                返回議題
            </Link>
            <div className="flex h-[calc(100hv-56px-69px-32px)] w-full items-stretch gap-7">
                <div className="w-2/3">
                    <ViewpointCard />
                </div>
                <div className="w-1/3">
                    <FactListCard facts={issue.facts} />
                </div>
            </div>
            {/* </div> */}
        </main>
    );
}
