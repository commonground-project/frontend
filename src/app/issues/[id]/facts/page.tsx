import { mockFact, mockFact2, mockFact3 } from "@/mock/conversationMock";
import AllFactsCard from "@/components/Conversation/Facts/AllFactsCard";

type FactsViewrops = {
    params: {
        id: string;
    };
};

export default function FactsPage({ params }: FactsViewrops) {
    const { id } = params;
    console.log(id);

    return (
        <div className="flex min-h-screen flex-col bg-neutral-200">
            <main className="flex flex-grow flex-col items-center p-8 pb-16">
                <AllFactsCard
                    facts={[mockFact, mockFact2, mockFact3]}
                    issueId={id}
                />
            </main>
        </div>
    );
}
