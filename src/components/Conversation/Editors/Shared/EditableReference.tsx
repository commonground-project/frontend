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

export default function EditableReference({
    fact,
    removeFact,
    inSelectionMode,
    isSelected,
    setIsSelected,
}: FactCardProps) {
    return (
        <div className="flex w-full gap-2.5 rounded-lg p-2 hover:bg-[#f0f0f0]">
            {inSelectionMode && (
                <div className="pt-1">
                    <Checkbox
                        radius={"xl"}
                        checked={isSelected}
                        readOnly
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsSelected(!isSelected);
                        }}
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
                            root: "float-right pr-0 pl-0 flex opacity-0 transition-opacity group-hover:opacity-100",
                        }}
                        onClick={() => removeFact(String(fact.id))}
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
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
