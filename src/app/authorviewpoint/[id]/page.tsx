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
        <div className="flex min-h-screen flex-col bg-neutral-200">
            <main className="flex flex-grow flex-col items-center p-8">
                <div className="w-full max-w-[1292px]">
                    <Link
                        href={`/issues/${id}`}
                        className="mb-2 ml-7 flex w-[100px] items-center text-lg font-semibold text-neutral-500 duration-300 hover:text-emerald-500"
                    >
                        <ArrowLongLeftIcon className="mr-1 inline-block h-6 w-6" />
                        返回議題
                    </Link>
                    <div className="float-left w-5/12">
                        <ViewpointCard />
                    </div>
                    <div className="float-right w-5/12">
                        <FactListCard facts={issue.facts} />
                    </div>
                </div>
            </main>
        </div>
    );
}
