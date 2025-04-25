import { motion } from "motion/react";
import { Modal } from "@mantine/core";
import { useEffect, useState } from "react";
import type { Fact } from "@/types/conversations.types";
import FactImportingBox from "./FactImportingBox";
import FactCreationBox from "./FactCreationBox";
import ErrorBoundary from "@/components/AppShell/ErrorBoundary";

type FactImportModalProps = {
    issueId: string;
    modalId: string | null;
    setModalId: (id: string | null) => void;
    factImportCallback?: () => void;
    viewpointFactList: Fact[];
    addFact: (newFact: Fact) => void;
};

export default function FactImportModal({
    issueId,
    modalId,
    setModalId,
    factImportCallback,
    viewpointFactList,
    addFact,
}: FactImportModalProps) {
    const [currentScreen, setCurrentScreen] = useState<number>(1); // 1: import, 2: create

    // reset the current screen to 1 when the modal opens
    useEffect(() => {
        setCurrentScreen(1);
    }, [modalId]);

    return (
        <Modal
            opened={modalId !== null}
            onClose={() => {
                setModalId(null);
                setCurrentScreen(1);
                if (factImportCallback) {
                    factImportCallback();
                }
            }}
            centered
            classNames={{
                title: "font-bold text-black",
            }}
            size="lg"
            title={["搜尋 CommonGround", "引入新的事實"][currentScreen - 1]}
        >
            <ErrorBoundary>
                <motion.div
                    initial={{ translateX: "0vw" }}
                    animate={{
                        translateX: `${(currentScreen - 1) * -100}vw`,
                        transition: {
                            type: "spring",
                            bounce: 0,
                            duration: 0.5,
                        },
                    }}
                    className={`${currentScreen === 1 ? "block" : "hidden"}`}
                >
                    <FactImportingBox
                        viewpointFactList={viewpointFactList}
                        addFact={addFact}
                        addFactCallback={() => setModalId(null)}
                        createFactCallback={() => setCurrentScreen(2)}
                    />
                </motion.div>
                <motion.div
                    initial={{ translateX: "100vw" }}
                    animate={{
                        translateX: `${(currentScreen - 2) * -100}vw`,
                        transition: {
                            type: "spring",
                            bounce: 0,
                            duration: 0.5,
                        },
                    }}
                    className={`${currentScreen === 2 ? "block" : "hidden"}`}
                >
                    <FactCreationBox
                        issueId={issueId}
                        creationID={modalId}
                        factCreationCallback={(createdFacts) => {
                            createdFacts.forEach((fact) => {
                                addFact(fact);
                            });
                            setModalId(null);
                        }}
                        goBackButton={true}
                        goBackButtonCallback={() => setCurrentScreen(1)}
                    />
                </motion.div>
            </ErrorBoundary>
        </Modal>
    );
}
