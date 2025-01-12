import type { Reaction, ViewPoint } from "@/types/conversations.types";
import ContentCard from "./ContentCard";
import FactCard from "./FactCard";
import TernaryReactions from "@/components/Conversation/Shared/TernaryReactions";
import { postReaction } from "@/lib/requests/viewpoints/postReaction";
import AuthorProfile from "../Shared/AuthorProfile";

type ViewpointCardProps = {
    viewpoint: ViewPoint;
};

export default function ViewpointCard({ viewpoint }: ViewpointCardProps) {
    return (
        <div className="flex">
            <div className="float-left w-9/12">
                <AuthorProfile
                    authorName={viewpoint.authorName}
                    authorAvatar={viewpoint.authorAvatar}
                    createdAt={viewpoint.createdAt}
                />
                <h1 className="text-lg font-semibold text-neutral-700">
                    {viewpoint.title}
                </h1>
                <ContentCard content={viewpoint.content} />
                <TernaryReactions
                    parentId={viewpoint.id}
                    initialReaction={viewpoint.userReaction.reaction}
                    initialCounts={{
                        like: viewpoint.likeCount,
                        reasonable: viewpoint.reasonableCount,
                        dislike: viewpoint.dislikeCount,
                    }}
                    mutationFn={(reaction: Reaction, auth_token: string) =>
                        postReaction({
                            viewpointId: viewpoint.id,
                            reaction,
                            auth_token,
                        })
                    }
                />
            </div>
            <div className="float-right flex w-3/12 pl-3">
                <div className="flex max-w-full flex-col">
                    <h1 className="my-2 text-xs font-extrabold text-black">
                        引注事實
                    </h1>
                    <div className="flex-1 overflow-auto">
                        <div className="max-h-0">
                            {/* <div className="absolute top-0 mb-2 h-4 font-normal text-black"></div> */}
                            {viewpoint.facts.map((fact, index, arr) => (
                                <div key={fact.id}>
                                    <FactCard fact={fact} factIndex={index} />
                                    {index !== arr.length - 1 && (
                                        <hr className="my-1 border-neutral-400" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
