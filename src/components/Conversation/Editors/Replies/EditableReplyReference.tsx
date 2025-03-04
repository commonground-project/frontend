import type { Fact } from "@/types/conversations.types";
import { ActionIcon, Checkbox } from "@mantine/core";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ReferenceBar from "@/components/Conversation/Facts/ReferenceBar";

type FactCardProps = {
    fact: Fact;
    removeFact: (id: string) => void;
    inSelectionMode: boolean;
    isSelected: boolean;
    setIsSelected: (isSelected: boolean) => void;
};

export default function EditableReplyReference({
    fact,
    removeFact,
    inSelectionMode,
    isSelected,
    setIsSelected,
}: FactCardProps) {
    return (
        <div className="rounded-lg p-2 hover:bg-gray-50">
            <div className="flex w-full gap-1">
                {inSelectionMode && (
                    <div className="pt-1">
                        <Checkbox
                            radius={"xl"}
                            checked={isSelected}
                            onChange={(e) =>
                                setIsSelected(e.currentTarget.checked)
                            }
                        />
                    </div>
                )}
                <div className="group flex w-full justify-between">
                    <div className="text-base font-bold text-black">
                        {/* max width 100% - 30px, 30px for x mark icon*/}
                        {fact.title}
                    </div>
                    <ActionIcon
                        variant="transparent"
                        classNames={{
                            root: "opacity-0 transition-opacity group-hover:opacity-100",
                        }}
                        onClick={() => removeFact(String(fact.id))}
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </ActionIcon>
                </div>
            </div>
            {fact.references.map((reference) => (
                <div key={reference.id} className="mt-1 flex items-center">
                    <ReferenceBar reference={reference} />
                    <div className="truncate text-base">{reference.title}</div>
                </div>
            ))}
        </div>
    );
}
