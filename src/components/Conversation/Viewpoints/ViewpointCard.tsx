import type { ViewPoint } from "@/types/conversations.types";
import ContentCard from "./ContentCard";
import FactListCard from "./FactListCard";

type ViewpointCardProps = {
    viewpoint: ViewPoint;
};

export default function ViewpointCard({ viewpoint }: ViewpointCardProps) {
    return (
        <div className="flex">
            <div className="float-left w-9/12">
                <ContentCard viewpoint={viewpoint} />
            </div>
            <div className="float-right flex w-3/12 pl-3">
                <FactListCard facts={viewpoint.facts} />
            </div>
        </div>
    );
}
