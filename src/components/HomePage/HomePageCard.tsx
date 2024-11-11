import { Issue } from "@/types/conversations.types";
import Link from "next/link";

type HomePageCardProps = {
    issues: Issue[];
};

export default function HomePageCard({ issues }: HomePageCardProps) {
    return (
        <div className="w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            {issues.map((issue, index) => (
                <div key={issue.id} className="group">
                    <Link href={`/issues/${issue.id}`}>
                        <h1 className="py-1 text-lg font-semibold duration-300 group-hover:text-emerald-500">
                            {issue.title}
                        </h1>
                        <p className="text-base font-normal">{issue.summary}</p>
                        {index !== issues.length - 1 && (
                            <hr className="my-4 border-neutral-500" />
                        )}
                    </Link>
                </div>
            ))}
        </div>
    );
}
