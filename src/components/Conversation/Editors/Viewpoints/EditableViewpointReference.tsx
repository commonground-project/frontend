import type { Fact } from "@/types/conversations.types";
import { Button, Checkbox } from "@mantine/core";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ReferenceBar from "@/components/Conversation/Facts/ReferenceBar";

type FactCardProps = {
    fact: Fact;
    removeFact: (id: string) => void;
    inSelectionMode: boolean;
    isSelected: boolean;
    setIsSelected: (isSelected: boolean) => void;
};

export default function EditableViewpointReference({
    fact,
    removeFact,
    inSelectionMode,
    isSelected,
    setIsSelected,
}: FactCardProps) {
    return (
        <div className="flex w-full gap-2.5 hover:bg-gray-50">
            {inSelectionMode && (
                <div className="pt-1">
                    <Checkbox
                        radius={"xl"}
                        checked={isSelected}
                        onChange={(e) => setIsSelected(e.currentTarget.checked)}
                    />
                </div>
            )}
            <div className="w-full">
                <div className="group flex w-full justify-between">
                    <h1 className="float-left max-w-[calc(100%-30px)] text-lg font-normal text-black">
                        {/* max width 100% - 30px, 30px for x mark icon*/}
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
                        <ReferenceBar
                            reference={reference}
                            showSrcTitle={true}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
