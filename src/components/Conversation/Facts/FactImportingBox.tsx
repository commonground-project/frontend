import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { Button, Input } from "@mantine/core";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import ImportFactCard from "./ImportFactCard";
import type { Fact } from "@/types/conversations.types";

type FactImportingBoxProps = {
    viewpointFactList: Fact[];
    addFact: (factId: string) => void;
    addFactCallback?: () => void;
    data: Fact[];
};

export default function FactImportingBox({
    viewpointFactList,
    addFact,
    addFactCallback,
    data,
}: FactImportingBoxProps) {
    const [searchData, setSearchData] = useState<Fact[]>([]); // eslint-disable-line
    const [searchValue, setSearchValue] = useState<string>(""); // eslint-disable-line
    const [creationId, setCreationId] = useState<string | null>(null); // eslint-disable-line
    const [addFactBuffer, setAddFactBuffer] = useState<string[]>([]); // eslint-disable-line

    return (
        <div className="flex w-full flex-col gap-4">
            <Input
                variant="unstyled"
                rightSection={
                    <MagnifyingGlassIcon className="inline-block h-5 w-5 stroke-neutral-500" />
                }
                value={searchValue}
                width={"100%"}
                onChange={(e) => setSearchValue(e.target.value)}
                radius={0}
                classNames={{
                    input: "bg-transparent text-lg font-normal text-neutral-500 focus-within:outline-b-2 focus-within:border-b-emerald-500 focus-within:outline-none",
                }}
                placeholder="透過搜尋加入想引註的事實"
            />
            <div className="flex max-h-[300px] flex-col gap-4 overflow-y-auto">
                {data.map((fact) => (
                    <ImportFactCard
                        key={fact.id}
                        fact={fact}
                        isSelected={addFactBuffer.includes(fact.id)}
                        setIsSelected={(isSelected) => {
                            if (isSelected) {
                                setAddFactBuffer((prev) => [...prev, fact.id]);
                            } else {
                                setAddFactBuffer((prev) =>
                                    prev.filter((id) => id !== fact.id),
                                );
                            }
                        }}
                    />
                ))}
            </div>
            {data.length === 0 && searchValue.length !== 0 && (
                <Button
                    onClick={() => setCreationId(uuidv4())}
                    variant="transparent"
                    classNames={{
                        root: "max-w-full h-auto px-0 text-neutral-600 text-base font-normal hover:text-emerald-500 duration-300",
                        label: "whitespace-normal text-left",
                    }}
                >
                    找不到想引註的事實嗎？將其引入 CommonGround 吧!
                </Button>
            )}
            <div className="flex w-full justify-end">
                <Button
                    onClick={() => {
                        addFactBuffer.forEach((factId) => {
                            addFact(factId);
                        });
                        setAddFactBuffer([]);
                        addFactCallback?.();
                    }}
                    variant="filled"
                >
                    <PlusIcon className="mr-2 size-4 text-white" />
                    加入
                </Button>
            </div>
        </div>
    );
}
