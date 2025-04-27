import { toast } from "sonner";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ImportFactCard from "../ImportFactCard";
import { Fact } from "@/types/conversations.types";

type FactImportingBoxProps = {
    searchValue: string;
    searchData: Fact[];
    viewpointFactList: Fact[];
    addFact: (fact: Fact) => void;
    goBackCallBack: () => void;
};

export default function FactImportingBox({
    searchValue,
    searchData,
    viewpointFactList,
    addFact,
    goBackCallBack,
}: FactImportingBoxProps) {
    return (
        <div className="flex w-full flex-col gap-4">
            <button
                className="mt-[14px] flex items-center justify-start gap-3"
                onClick={goBackCallBack}
            >
                <ArrowLeftIcon className="size-6 text-black" />
                <div className="text-lg">{searchValue}</div>
            </button>
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
        </div>
    );
}
