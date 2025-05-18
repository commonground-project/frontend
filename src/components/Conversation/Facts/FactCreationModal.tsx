"use client";

import { Modal } from "@mantine/core";
import type { Fact } from "@/types/conversations.types";
import FactCreationBox from "./FactCreationBox";
import ErrorBoundary from "@/components/AppShell/ErrorBoundary";

type FactModelProps = {
    issueId: string;
    creationID: string | null;
    setCreationID: (newId: string | null) => void;
    factCreationCallback?: (createdFact: Fact[]) => void;
};

export default function FactCreationModal({
    issueId,
    creationID,
    setCreationID,
    factCreationCallback,
}: FactModelProps) {
    return (
        <Modal
            opened={creationID !== null}
            onClose={() => setCreationID(null)}
            size="620px"
            centered
            classNames={{
                title: "font-bold text-black",
            }}
            title="引入新的事實"
        >
            <ErrorBoundary>
                <FactCreationBox
                    issueId={issueId}
                    creationID={creationID}
                    factCreationCallback={(createdFacts: Fact[]) => {
                        factCreationCallback?.(createdFacts);
                        setCreationID(null);
                    }}
                />
            </ErrorBoundary>
        </Modal>
    );
}
