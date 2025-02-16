"use client";

import { createContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export const ReferenceMarkerContext = createContext<{
    selectedFacts: Map<number, number[]>;
    setSelectedFacts: Dispatch<SetStateAction<Map<number, number[]>>>;
    inSelectionMode: boolean;
    setInSelectionMode: Dispatch<SetStateAction<boolean>>;
    curReferenceMarkerId: number | null;
    setCurReferenceMarkerId: Dispatch<SetStateAction<number | null>>;
    avaliableMarkerId: number;
    setAvaliableMarkerId: Dispatch<SetStateAction<number>>;
}>({
    selectedFacts: new Map().set(0, []),
    setSelectedFacts: () => {},
    inSelectionMode: false,
    setInSelectionMode: () => {},
    curReferenceMarkerId: null,
    setCurReferenceMarkerId: () => {},
    avaliableMarkerId: 0,
    setAvaliableMarkerId: () => {},
});

export default function ReferenceMarkerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [selectedFacts, setSelectedFacts] = useState<Map<number, number[]>>(
        new Map().set(0, []),
    );
    const [inSelectionMode, setInSelectionMode] = useState<boolean>(false);
    const [curReferenceMarkerId, setCurReferenceMarkerId] = useState<
        number | null
    >(null);
    const [avaliableMarkerId, setAvaliableMarkerId] = useState<number>(0);

    return (
        <ReferenceMarkerContext.Provider
            value={{
                selectedFacts,
                setSelectedFacts,
                inSelectionMode,
                setInSelectionMode,
                curReferenceMarkerId,
                setCurReferenceMarkerId,
                avaliableMarkerId,
                setAvaliableMarkerId,
            }}
        >
            {children}
        </ReferenceMarkerContext.Provider>
    );
}
