import { Skeleton } from "@mantine/core";

export default function ReplySkeleton() {
    return (
        <div className="w-full">
            <div className="mb-3 flex items-center gap-2">
                <Skeleton height={20} circle />
                <Skeleton className="w-20" height={16} radius="xl" />
            </div>
            <div>
                <Skeleton height={16} radius="xl" mb={6} />
                <Skeleton height={16} radius="xl" mb={6} />
                <Skeleton height={16} radius="xl" mb={6} />
            </div>
        </div>
    );
}
