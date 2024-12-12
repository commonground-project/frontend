"use client";

import {
    mockIssue,
    mockEmptyIssue,
    mockFact,
    mockFact2,
    mockFact3,
} from "@/mock/conversationMock";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AllFactsCard from "@/components/Conversation/Facts/AllFactsCard";
import FactModel from "@/components/Conversation/Facts/FactModel";

type FactsViewProps = {
    params: {
        id: string;
    };
};

export default function FactsPage({ params }: FactsViewProps) {
    const [opened, { open, close }] = useDisclosure(false);
    const { id } = params;
    const issue = id == "1" ? mockIssue : mockEmptyIssue;
    const facts = [mockFact, mockFact2, mockFact3];

    return (
        <div className="flex min-h-screen flex-col bg-neutral-200">
            <main className="flex flex-grow flex-col items-center p-8 pb-16">
                <div className="mb-6 w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
                    <h1 className="py-1 font-sans text-2xl font-bold">
                        {issue.title}
                    </h1>

                    <div className="mt-3">
                        <h2 className="mb-1 text-lg font-semibold text-black">
                            所有事實
                        </h2>
                        <AllFactsCard
                            facts={facts}
                        />
                    </div>

                    <FactModel
                        opened={opened}
                        onClose={close}
                        fact={facts[0]}
                        onUpdate={(updateFact) => console.log(updateFact)}
                    />

                    <Button
                        onClick={open}
                        leftSection={<PlusIcon className="h-5 w-5" />}
                        variant="subtle" 
                        color="black"
                        size="compact-md"
                        classNames={{
                            root: "px-0 hover:bg-neutral-100",
                            inner: "justify-start",
                            label: "font-sans font-bold text-md"
                        }}
                    >
                        新增事實
                    </Button>
                </div>
            </main>
        </div>
    );
}
