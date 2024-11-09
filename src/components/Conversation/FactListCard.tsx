import { Fact } from "@/types/conversations.types";
import FactCard from "@/components/Conversation/FactCard";

type FactListCardProps = {
    facts: Fact[];
};

export default function FactListCard({ facts }: FactListCardProps) {
    return (
        <>
            <h1 className="my-2 text-xs font-normal text-black">引注事實</h1>
            <div className="flex-1 overflow-y-auto px-1">
                <div className="max-h-0">
                    {/* <div className="absolute top-0 mb-2 h-4 font-normal text-black"></div> */}
                    {facts.map((fact, index) => (
                        <div key={fact.id}>
                            <FactCard fact={fact} factindex={index} />
                            {index !== facts.length - 1 && (
                                <hr className="my-1 border-neutral-400" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
