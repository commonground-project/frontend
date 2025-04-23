import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { Modal, Select, Button } from "@mantine/core";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { Fact } from "@/types/conversations.types";

type FactImportModalProps = {
    importId: string | null;
    setIportId: (id: string | null) => void;
    factImportCallback?: boolean;
    viewpointFactList: Fact[];
    addFact: (factId: string) => void;
    data: Fact[];
};
export default function FactImportModal({
    importId,
    setIportId,
    factImportCallback,
    viewpointFactList,
    addFact,
    data,
}: FactImportModalProps) {
    const [searchData, setSearchData] = useState<Fact[]>([]); // eslint-disable-line
    const [searchValue, setSearchValue] = useState<string>(""); // eslint-disable-line
    const [creationId, setCreationId] = useState<string | null>(null); // eslint-disable-line

    return (
        <Modal
            opened={importId !== null}
            onClose={() => setIportId(null)}
            centered
            classNames={{
                title: "font-bold text-black",
            }}
            title="搜尋 CommonGround"
        >
            <div className="flex w-full items-center py-1 pr-[52px]">
                <MagnifyingGlassIcon className="inline-block h-5 w-5 stroke-neutral-500" />
                <Select
                    variant="unstyled"
                    searchable
                    value={searchValue}
                    onChange={(selectedFactId) => {
                        if (!selectedFactId) return;
                        addFact(selectedFactId);
                    }}
                    data={data
                        .filter(
                            (fact) =>
                                !viewpointFactList.some(
                                    (viewpointFact) =>
                                        viewpointFact.id === fact.id,
                                ),
                        )
                        .map((fact) => ({
                            value: String(fact.id),
                            label: fact.title,
                        }))}
                    checkIconPosition="right"
                    radius={0}
                    classNames={{
                        input: "ml-2 bg-transparent text-lg font-normal text-neutral-500 focus-within:outline-b-2 focus-within:border-b-emerald-500 focus-within:outline-none",
                    }}
                    placeholder="搜尋 CommonGround"
                    nothingFoundMessage={
                        <Button
                            onClick={() => setCreationId(uuidv4())}
                            variant="transparent"
                            classNames={{
                                root: "max-w-full h-auto px-0 text-neutral-600 text-base font-normal hover:text-emerald-500 duration-300",
                                inner: "flex justify-start",
                                label: "whitespace-normal text-left",
                            }}
                        >
                            找不到想引註的事實嗎？將其引入 CommonGround 吧!
                        </Button>
                    }
                />
            </div>
        </Modal>
    );
}
