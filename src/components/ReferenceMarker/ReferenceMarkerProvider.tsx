"use client";

import { createContext, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export const ReferenceMarkerContext = createContext<{
    selectedFacts: Map<number, number[]>;
    setSelectedFacts: Dispatch<SetStateAction<Map<number, number[]>>>;
}>({
    selectedFacts: new Map().set(0, []),
    setSelectedFacts: () => {},
});

export default function ReferenceMarkerProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [selectedFacts, setSelectedFacts] = useState<Map<number, number[]>>(
        new Map().set(0, []),
    );

    return (
        <ReferenceMarkerContext.Provider
            value={{ selectedFacts, setSelectedFacts }}
        >
            {children}
        </ReferenceMarkerContext.Provider>
    );
}
