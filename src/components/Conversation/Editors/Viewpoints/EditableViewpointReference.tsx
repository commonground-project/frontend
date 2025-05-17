import type { Fact } from "@/types/conversations.types";
import { ActionIcon, Checkbox } from "@mantine/core";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import ReferenceBar from "@/components/Conversation/Facts/ReferenceBar";

type FactCardProps = {
    index: number;
    fact: Fact;
    removeFact: (id: string) => void;
    inSelectionMode: boolean;
    isSelected: boolean;
    setIsSelected: (isSelected: boolean) => void;
    withBorder?: boolean;
    linkBarWithBG?: boolean;
    showDeleteIcon?: boolean;
};

export default function EditableViewpointReference({
    index,
    fact,
    removeFact,
    inSelectionMode,
    isSelected,
    setIsSelected,
    withBorder = true,
    linkBarWithBG = true,
    showDeleteIcon = false,
}: FactCardProps) {
    return (
        <div
            className={`flex w-full gap-2.5 rounded-lg ${withBorder ? "border border-neutral-400 p-4" : ""} hover:bg-[#f0f0f0]`}
        >
            {inSelectionMode ? (
                <div className="flex-shrink-0 pt-1">
                    <Checkbox
                        checked={isSelected}
                        readOnly
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsSelected(!isSelected);
                        }}
                    />
                </div>
            ) : (
                <div className="font-mono">{`[${index}]`}</div>
            )}
            <div className="min-w-0 flex-1">
                <div className="group flex w-full justify-between">
                    <h1 className="text-lg font-normal text-black">
                        {/* max width 100% - 30px, 30px for x mark icon*/}
                        {fact.title}
                    </h1>
                    <ActionIcon
                        variant="transparent"
                        classNames={{
                            root: showDeleteIcon
                                ? ""
                                : "opacity-0 transition-opacity group-hover:opacity-100",
                        }}
                        onClick={() => removeFact(String(fact.id))}
                    >
                        <MinusCircleIcon className="h-5 w-5 text-neutral-500 hover:text-neutral-600" />
                    </ActionIcon>
                </div>
                {fact.references.map((reference) => (
                    <div key={reference.id} className="mt-1 flex min-w-0">
                        <ReferenceBar
                            key={reference.id}
                            reference={reference}
                            showSrcTitle={true}
                            withBackground={linkBarWithBG}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
