import { Modal } from "@mantine/core";
import type { Fact } from "@/types/conversations.types";
import FactImportingBox from "./FactImportingBox";

type FactImportModalProps = {
    importId: string | null;
    setImportId: (id: string | null) => void;
    factImportCallback?: () => void;
    viewpointFactList: Fact[];
    addFact: (newFact: Fact) => void;
};

export default function FactImportModal({
    importId,
    setImportId,
    factImportCallback,
    viewpointFactList,
    addFact,
}: FactImportModalProps) {
    return (
        <Modal
            opened={importId !== null}
            onClose={() => {
                setImportId(null);
                if (factImportCallback) {
                    factImportCallback();
                }
            }}
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
                addFactCallback={() => setImportId(null)}
            />
        </Modal>
    );
}
