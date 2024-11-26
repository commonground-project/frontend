import { Fact } from "@/types/conversations.types";
import EditViewpointFact from "@/components/AuthorViewpoint/EditViewpointFact";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Select, Button } from "@mantine/core";

type FactListCardProps = {
    facts: Fact[];
};

export default function FactListCard({ facts }: FactListCardProps) {
    return (
        <div className="h-[calc(100vh-56px-69px-32px)] rounded-lg bg-neutral-100 px-7 py-4">
            <h1 className="mb-1 text-lg font-semibold text-neutral-700">
                事實
            </h1>
            <div className="mb-2 flex w-full items-center py-1 pr-[52px]">
                <MagnifyingGlassIcon className="inline-block h-5 w-5 stroke-neutral-500" />
                <Select
                    variant="unstyled"
                    searchable
                    data={[
                        "This development could disrupt the EV market",
                        "Google.com",
                        "CommonGround",
                    ]}
                    checkIconPosition="right"
                    radius={0}
                    w="100%"
                    classNames={{
                        input: "ml-2 bg-transparent text-lg font-normal text-neutral-500 focus-within:outline-b-2 focus-within:border-b-emerald-500 focus-within:outline-none",
                    }}
                    placeholder="搜尋 CommonGround"
                />
            </div>
            <div className="h-[calc(100vh-56px-69px-32px-92px-16px)] overflow-auto">
                <div className="flex flex-col gap-3 pl-7 pr-4">
                    {facts.map((fact) => (
                        <div key={fact.id}>
                            <EditViewpointFact fact={fact} />
                        </div>
                    ))}
                </div>

                <Button
                    variant="transparent"
                    leftSection={<PlusIcon className="h-6 w-6" />}
                    classNames={{
                        root: "px-0 ml-7 mt-2 text-neutral-600 text-base font-normal hover:text-emerald-500 duration-300",
                        section: "mr-2",
                    }}
                >
                    引入一條事實
                </Button>
            </div>
        </div>
    );
}
