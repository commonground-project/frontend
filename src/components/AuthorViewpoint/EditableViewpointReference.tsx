import { Fact } from "@/types/conversations.types";
import { Button } from "@mantine/core";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ReferenceBar from "@/components/Conversation/Facts/ReferenceBar";

type FactCardProps = {
    fact: Fact;
    removeFact: (id: string) => void;
};

export default function EditableViewpointReference({
    fact,
    removeFact,
}: FactCardProps) {
    return (
        <div>
            <div className="group flex">
                <h1 className="float-left text-lg font-normal text-black">
                    {fact.title}
                </h1>
                <Button
                    variant="transparent"
                    classNames={{
                        root: "float-right pr-1 pl-0 flex invisible group-hover:visible",
                    }}
                    onClick={() => removeFact(String(fact.id))}
                >
                    <XMarkIcon className="size-6 stroke-black hover:stroke-red-600" />
                </Button>
            </div>
            {fact.references.map((reference) => (
                <div key={reference.id} className="mt-1">
                    <ReferenceBar reference={reference} showSrcTitle={true} />
                </div>
            ))}
        </div>
    );
}
