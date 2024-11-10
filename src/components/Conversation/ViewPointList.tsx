import { ViewPoint } from "@/types/conversations.types";
import EmptyViewPointCard from "@/components/Conversation/EmptyViewPointCard";
import ViewPointCard from "@/components/Conversation/ViewPointCard";
type ViewPointListProps = {
    viewpoints: ViewPoint[];
    issueid: string;
};

export default function ViewPointList({
    viewpoints,
    issueid,
}: ViewPointListProps) {
    return (
        <div className="w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            <h1 className="text-xl font-semibold">查看所有觀點</h1>
            {viewpoints.length === 0 ? (
                <EmptyViewPointCard id={issueid} />
            ) : (
                <div className="flex-col">
                    {viewpoints.map((viewpoint, index) => (
                        <div key={viewpoint.id}>
                            <ViewPointCard viewpoint={viewpoint} />
                            {index !== viewpoints.length - 1 && (
                                <hr className="my-4 w-full border-neutral-500" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
