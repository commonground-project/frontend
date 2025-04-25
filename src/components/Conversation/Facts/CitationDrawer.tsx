"use client";
import { useEffect, useState } from "react";
import { Drawer } from "@mantine/core";
import { Fact } from "@/types/conversations.types";

type FactImportModalProps = {
    issueId: string;
    drawerId: string | null;
    setDrawerId: (id: string | null) => void;
    factImportCallback?: () => void;
    viewpointFactList: Fact[];
    addFact: (newFact: Fact) => void;
};

export default function CitationDrawer({
    issueId,
    drawerId,
    setDrawerId,
    factImportCallback,
    viewpointFactList,
    addFact,
}: FactImportModalProps) {
    const [currentScreen, setCurrentScreen] = useState<number>(1); // 1: import, 2: create

    useEffect(() => {
        setCurrentScreen(1);
    }, [drawerId]);

    return (
        <Drawer
            opened={drawerId !== null}
            onClose={() => {
                setDrawerId(null);
                setCurrentScreen(1);
                if (factImportCallback) {
                    factImportCallback();
                }
            }}
            position="bottom"
            classNames={{
                title: "font-bold text-black",
            }}
            radius={12}
            size="lg"
            withCloseButton={false}
            title={["搜尋 CommonGround", "引入新的事實"][currentScreen - 1]}
        ></Drawer>
    );
}
