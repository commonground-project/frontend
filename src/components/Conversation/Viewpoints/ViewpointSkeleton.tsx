import { Skeleton } from "@mantine/core";

export default function ViewpointSkeleton() {
    return (
        <div className="w-full">
            <Skeleton height={20} circle mb={12} />
            <div className="flex gap-4">
                <div className="w-[75%] justify-start">
                    <Skeleton height={10} radius="xl" mb={6} />
                    <Skeleton height={10} radius="xl" mb={6} />
                    <Skeleton height={10} radius="xl" mb={6} />
                </div>
                <div className="w-[20%] justify-end">
                    <Skeleton height={10} radius="xl" mb={6} />
                    <Skeleton height={10} radius="xl" mb={6} />
                    <Skeleton height={10} radius="xl" mb={6} />
                </div>
            </div>
        </div>
    );
}
