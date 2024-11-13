import { mockViewPointList } from "@/mock/conversationMock";
import EmptyViewPointCard from "@/components/Conversation/ViewPoints/EmptyViewPointSection";
import ViewPointCard from "@/components/Conversation/ViewPoints/ViewPointCard";

type ViewPointListProps = {
    issueId: string;
};

export default function ViewPointList({ issueId }: ViewPointListProps) {
    const viewpoints = issueId == "1" ? mockViewPointList : [];
    return (
        <div className="w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            <h1 className="mb-2 text-xl font-semibold">查看所有觀點</h1>
            {viewpoints.length === 0 ? (
                <EmptyViewPointCard id={issueId} />
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
