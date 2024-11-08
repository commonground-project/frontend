import { Fact } from "@/types/conversations.types";
type FactCardProps = {
    fact: Fact;
    factindex: number;
};

export default function FactCard({ fact, factindex }: FactCardProps) {
    return (
        <div className="flex">
            <h1 className="inline-block text-xs font-normal text-black">
                [{factindex + 1}]
            </h1>
            <div className="inline-block px-1">
                <h1 className="text-xs font-normal text-black">{fact.title}</h1>
                {/* sources */}

                {fact.sources.map((source) => (
                    <div key={source.id} className="flex items-center">
                        <img
                            className="inline-block h-3 w-3 rounded-full"
                            src={source.icon}
                        />
                        <h1 className="inline-block pl-1 font-sans text-xs font-normal text-neutral-500">
                            {source.website}
                        </h1>
                    </div>
                ))}
            </div>
        </div>
    );
}
