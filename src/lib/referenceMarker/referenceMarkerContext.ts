import { createContext } from "react";

type ReferenceMarkerContext = {
    inSelectionMode: boolean;
    inputRef: React.RefObject<HTMLDivElement | null>;
    addFactToReferenceMarker: (factIndex: number) => void;
    removeFactFromReferenceMarker: (factIndex: number) => void;
    removeFactFromAllReferenceMarker: (factIndex: number) => void;
    getCurSelectedFacts: () => number[];
};

export const ReferenceMarkerContext = createContext<ReferenceMarkerContext>({
    inSelectionMode: false,
    inputRef: { current: null },
    addFactToReferenceMarker: () => {},
    removeFactFromReferenceMarker: () => {},
    removeFactFromAllReferenceMarker: () => {},
    getCurSelectedFacts: () => [],
});
