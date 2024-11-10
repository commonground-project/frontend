import { Issue } from "@/types/conversations.types";
import { RectangleStackIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import EmptyIssueCard from "@/components/Conversation/EmptyIssueCard";

type IssueCardProps = {
    issue: Issue;
};
export default function IssueCard({ issue }: IssueCardProps) {
    return (
        <div className="mb-6 w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            <h1 className="py-1 font-sans text-2xl font-bold">{issue.title}</h1>
            {issue.summary !== "" ? (
                <>
                    <h1 className="mt-3 text-lg font-semibold">事件簡述</h1>
                    <p className="text-lg font-normal">{issue.summary}</p>
                    <div className="mt-3">
                        <Link
                            href=""
                            className="text-lg font-semibold transition-colors duration-300 hover:text-green-400"
                        >
                            查看所有事實
                            <RectangleStackIcon className="ml-1 inline-block h-4 w-4" />
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    <EmptyIssueCard id={issue.id} />
                </>
            )}
        </div>
    );
}
