import { PlusCircleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { ActionIcon } from "@mantine/core";
import type { Fact } from "@/types/conversations.types";
import ReferenceBar from "@/components/Conversation/Facts/ReferenceBar";

type ImportFactCardProps = {
    fact: Fact;
    isSelected: boolean;
    setIsSelected: (isSelected: boolean) => void;
};

export default function ImportFactCard({
    fact,
    isSelected,
    setIsSelected,
}: ImportFactCardProps) {
    return (
        <div className="flex w-full">
            <div className="min-w-0 flex-1">
                <div className="flex w-full justify-between">
                    <h1 className="text-lg font-normal text-black">
                        {/* max width 100% - 30px, 30px for x mark icon*/}
                        {fact.title}
                    </h1>
                    <ActionIcon
                        variant="transparent"
                        onClick={() => {
                            setIsSelected(!isSelected);
                        }}
                    >
                        {isSelected ? (
                            <CheckCircleIcon className="size-7 text-emerald-500" />
                        ) : (
                            <PlusCircleIcon className="size-7 text-black" />
                        )}
                    </ActionIcon>
                </div>
                {fact.references.map((reference) => (
                    <div key={reference.id} className="mt-1.5 flex min-w-0">
                        <ReferenceBar
                            key={reference.id}
                            reference={reference}
                            showSrcTitle={true}
                            withBackground={false}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
