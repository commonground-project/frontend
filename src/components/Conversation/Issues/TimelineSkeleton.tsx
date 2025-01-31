import { Skeleton } from "@mantine/core";

export default function TimelineSkeleton() {
    return (
        <div className="ml-[60px]">
            <Skeleton height={20} width={400} />
            <div className="mt-4 flex flex-col gap-2">
                <Skeleton height={16} width={506} />
                <Skeleton height={16} width={506} />
                <Skeleton height={16} width={300} />
            </div>
        </div>
    );
}
