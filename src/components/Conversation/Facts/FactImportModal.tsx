import { Modal } from "@mantine/core";
import type { Fact } from "@/types/conversations.types";
import FactImportingBox from "./FactImportingBox";
import { set } from "lodash";

type FactImportModalProps = {
    importId: string | null;
    setImportId: (id: string | null) => void;
    factImportCallback?: boolean;
    viewpointFactList: Fact[];
    addFact: (factId: string) => void;
    data: Fact[];
};

export default function FactImportModal({
    importId,
    setImportId,
    factImportCallback,
    viewpointFactList,
    addFact,
    data,
}: FactImportModalProps) {
    return (
        <Modal
            opened={importId !== null}
            onClose={() => setImportId(null)}
            centered
            classNames={{
                title: "font-bold text-black",
            }}
            size="lg"
            title="搜尋 CommonGround"
        >
            <FactImportingBox
                viewpointFactList={viewpointFactList}
                addFact={addFact}
                data={data}
                addFactCallback={() => setImportId(null)}
            />
        </Modal>
    );
}
