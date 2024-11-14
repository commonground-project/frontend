import ViewpointCard from "@/components/AuthorViewpoint/ViewpointCard";
import Link from "next/link";
import { ArrowLongLeftIcon } from "@heroicons/react/24/outline";

type AuthorViewPointProps = {
    params: {
        id: string;
    };
};

export default function AuthorViewPoint({ params }: AuthorViewPointProps) {
    const { id } = params;
    return (
        <div className="flex min-h-screen flex-col bg-neutral-200">
            <main className="flex flex-grow flex-col px-[110px] pt-7">
                <Link
                    href={`/issues/${id}`}
                    className="mb-2 ml-7 flex items-center text-lg font-semibold text-neutral-500"
                >
                    <ArrowLongLeftIcon className="mr-1 inline-block h-6 w-6" />
                    返回議題
                </Link>
                <div className="float-left w-6/12">
                    <ViewpointCard />
                </div>
            </main>
        </div>
    );
}
