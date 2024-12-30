import { Issue } from "@/types/conversations.types";
import Link from "next/link";

type HomePageCardProps = {
    issues: Issue[];
};

export default function HomePageCard({ issues }: HomePageCardProps) {
    return (
        <div className="w-full max-w-3xl rounded-md bg-neutral-100 px-7 py-6 text-black">
            {issues.map((issue, index) => (
                <div key={issue.id} className="group">
                    <Link href={`/issues/${issue.id}`}>
                        <h1 className="text-lg font-semibold duration-300 group-hover:text-emerald-500">
                            {issue.title}
                        </h1>
                        <p className="mt-1 text-base font-normal">
                            {issue.description}
                        </p>
                        {index !== issues.length - 1 && (
                            <hr className="my-3 border-neutral-500" />
                        )}
                    </Link>
                </div>
            ))}
        </div>
    );
}
