import type { Issue } from "@/types/conversations.types";
import Link from "next/link";
import { forwardRef } from "react";

type HomePageCardProps = {
    issue: Issue;
};

const HomePageCard = forwardRef<HTMLAnchorElement, HomePageCardProps>(
    ({ issue }, ref) => {
        return (
            <Link href={`/issues/${issue.id}`} ref={ref}>
                <h1 className="text-lg font-semibold duration-300 group-hover:text-emerald-500">
                    {issue.title}
                </h1>
                <p className="mt-1 whitespace-pre-wrap text-base font-normal">
                    {issue.description.slice(0, 100) + "..."}
                </p>
            </Link>
        );
    },
);

HomePageCard.displayName = "HomePageCard";

export default HomePageCard;
