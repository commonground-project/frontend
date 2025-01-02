type FactSkeletonProps = {
    references?: number;
};

export default function FactSkeleton({ references = 3 }: FactSkeletonProps) {
    return (
        <div className="mb-2">
            <div className="mb-2 h-7 w-40 animate-pulse rounded-md bg-neutral-300" />
            <div className="flex flex-col gap-1">
                {Array(references)
                    .fill(0)
                    .map((__, i) => (
                        <div
                            key={i}
                            className="h-5 w-full animate-pulse rounded-md bg-neutral-300"
                        />
                    ))}
            </div>
        </div>
    );
}
