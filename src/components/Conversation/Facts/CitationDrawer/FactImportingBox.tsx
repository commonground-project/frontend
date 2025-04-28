import { toast } from "sonner";
import {
    ArrowLeftIcon,
    DocumentMinusIcon,
    PlusIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@mantine/core";
import ImportFactCard from "../ImportFactCard";
import type { Fact } from "@/types/conversations.types";

type FactImportingBoxProps = {
    searchValue: string;
    searchData: Fact[];
    viewpointFactList: Fact[];
    addFact: (fact: Fact) => void;
    createFactCallback: () => void;
    goBackCallBack: () => void;
};

export default function FactImportingBox({
    searchValue,
    searchData,
    viewpointFactList,
    addFact,
    createFactCallback, // will be called when user click create new fact
    goBackCallBack,
}: FactImportingBoxProps) {
    return (
        <div className="flex h-full w-full flex-col">
            <button
                className="flex items-center justify-start gap-3"
                onClick={goBackCallBack}
            >
                <ArrowLeftIcon className="size-6 text-black" />
                <div className="text-lg">{searchValue}</div>
            </button>
            {searchData.length === 0 ? (
                <>
                    <div className="flex h-full flex-col items-center justify-center">
                        <DocumentMinusIcon className="size-24 text-neutral-500" />
                        <div className="text-neutral-500">找不到相關事實</div>
                    </div>
                    <Button
                        onClick={createFactCallback}
                        radius={8}
                        className="h-10"
                    >
                        <PlusIcon className="size-5 text-neutral-50" />
                        <div className="text-sm text-neutral-50">
                            引入一則事實
                        </div>
                    </Button>
                </>
            ) : (
                <div className="flex w-full flex-col gap-3">
                    {searchData.map(
                        (fact) =>
                            !viewpointFactList.some(
                                (item) => item.id === fact.id,
                            ) && (
                                <ImportFactCard
                                    key={fact.id}
                                    fact={fact}
                                    isSelected={viewpointFactList.some(
                                        (item) => item.id === fact.id,
                                    )}
                                    setIsSelected={(isSelected) => {
                                        if (isSelected) {
                                            addFact(fact);
                                            toast.success(
                                                `已加入 ${fact.title} 到你的事實列表`,
                                            );
                                        }
                                    }}
                                />
                            ),
                    )}
                </div>
            )}
        </div>
    );
}
