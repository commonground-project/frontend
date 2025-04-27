"use client";
import { motion } from "motion/react";
import {
    useEffect,
    useState,
    useRef,
    type Dispatch,
    type SetStateAction,
} from "react";
import { Drawer } from "@mantine/core";

import FactListBox from "@/components/Conversation/Facts/CitationDrawer/FactListBox";
import FactImportingBox from "@/components/Conversation/Facts/CitationDrawer/FactImportingBox";
import type { Fact } from "@/types/conversations.types";

type FactImportModalProps = {
    issueId: string;
    drawerId: string | null;
    setDrawerId: (id: string | null) => void;
    factImportCallback?: () => void;
    viewpointFactList: Fact[];
    setViewpointFactList: Dispatch<SetStateAction<Fact[]>>;
    addFact: (newFact: Fact) => void;
};

export default function CitationDrawer({
    issueId: __issueId,
    drawerId,
    setDrawerId,
    factImportCallback,
    viewpointFactList,
    setViewpointFactList,
    addFact: addFact,
}: FactImportModalProps) {
    const [currentScreen, setCurrentScreen] = useState<number>(1); // 1: import, 2: create
    const searchData = useRef<Fact[]>([]);
    const searchValue = useRef<string>("");

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
                body: "h-[calc(100%-80px)]",
            }}
            radius={12}
            size="lg"
            withCloseButton={false}
            title={["搜尋 CommonGround", "引入新的事實"][currentScreen - 1]}
        >
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
                <FactListBox
                    factList={viewpointFactList}
                    setFactList={setViewpointFactList}
                    searchCallback={(value: string, data: Fact[]) => {
                        searchValue.current = value;
                        searchData.current = data;
                        setCurrentScreen(2);
                    }}
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
                <FactImportingBox
                    searchValue={searchValue.current}
                    searchData={searchData.current}
                    viewpointFactList={viewpointFactList}
                    addFact={addFact}
                    goBackCallBack={() => {
                        setCurrentScreen(1);
                    }}
                />
            </motion.div>
        </Drawer>
    );
}
