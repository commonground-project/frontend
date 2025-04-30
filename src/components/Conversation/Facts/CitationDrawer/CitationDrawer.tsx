"use client";
import { motion } from "motion/react";
import {
    useEffect,
    useState,
    useRef,
    type Dispatch,
    type SetStateAction,
    useContext,
} from "react";
import { Drawer } from "@mantine/core";

import FactListBox from "@/components/Conversation/Facts/CitationDrawer/FactListBox";
import FactImportingBox from "@/components/Conversation/Facts/CitationDrawer/FactImportingBox";
import FactCreationBox from "@/components/Conversation/Facts/CitationDrawer/FactCreationBox";
import ErrorBoundary from "@/components/AppShell/ErrorBoundary";
import type { Fact } from "@/types/conversations.types";
import { ReferenceMarkerContext } from "@/lib/referenceMarker/referenceMarkerContext";

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
    issueId,
    drawerId,
    setDrawerId,
    factImportCallback,
    viewpointFactList,
    setViewpointFactList,
    addFact: addFact,
}: FactImportModalProps) {
    const { getSelectedText } = useContext(ReferenceMarkerContext);
    const [currentScreen, setCurrentScreen] = useState<number>(1); // 1: import, 2: create
    const searchData = useRef<Fact[]>([]);
    const searchValue = useRef<string>("");
    const selectedText = useRef<string>("");

    useEffect(() => {
        selectedText.current = getSelectedText();
        setCurrentScreen(1);
    }, [drawerId, getSelectedText]);

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
                content: "rounded-t-xl",
                body: "h-[calc(100%-80px)]",
            }}
            size="lg"
            withCloseButton={false}
            title={
                [
                    `選擇「${selectedText.current}」的引註資料`,
                    "搜尋 CommonGround 事實",
                    "引入新的事實",
                ][currentScreen - 1]
            }
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
                    className={`h-full ${currentScreen === 1 ? "block" : "hidden"}`}
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
                    className={`h-full ${currentScreen === 2 ? "block" : "hidden"}`}
                >
                    <FactImportingBox
                        searchValue={searchValue.current}
                        searchData={searchData.current}
                        viewpointFactList={viewpointFactList}
                        addFact={addFact}
                        goBackCallBack={() => {
                            setCurrentScreen(1);
                        }}
                        createFactCallback={() => {
                            setCurrentScreen(3);
                        }}
                    />
                </motion.div>
                <motion.div
                    initial={{ translateX: "100vw" }}
                    animate={{
                        translateX: `${(currentScreen - 3) * -100}vw`,
                        transition: {
                            type: "spring",
                            bounce: 0,
                            duration: 0.5,
                        },
                    }}
                    className={`h-full ${currentScreen === 3 ? "block" : "hidden"}`}
                >
                    <FactCreationBox
                        issueId={issueId}
                        creationID={drawerId}
                        factCreationCallback={() => {
                            setDrawerId(null);
                        }}
                        goBackButton={true}
                        goBackButtonCallback={() => {
                            setCurrentScreen(2);
                        }}
                    />
                </motion.div>
            </ErrorBoundary>
        </Drawer>
    );
}
