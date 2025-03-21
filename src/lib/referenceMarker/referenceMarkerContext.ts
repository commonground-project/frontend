import { createContext } from "react";

type ReferenceMarkerContext = {
    inSelectionMode: boolean;
    inputRef: React.RefObject<HTMLDivElement | null>;
    addFactToReferenceMarker: (factIndex: number) => void;
    removeFactFromReferenceMarker: (factIndex: number) => void;
    removeFactFromAllReferenceMarker: (factIndex: number) => void;
    getCurSelectedFacts: () => number[];
    getInputFieldContent: () => string; // get the content in input field in backend format
};

export const ReferenceMarkerContext = createContext<ReferenceMarkerContext>({
    inSelectionMode: false,
    inputRef: { current: null },

    // Print error message if the function is called without setting up the provider
    addFactToReferenceMarker: () =>
        console.error(
            "ReferenceMarkerProvider not found or has not been set up",
        ),
    removeFactFromReferenceMarker: () =>
        console.error(
            "ReferenceMarkerProvider not found or has not been set up",
        ),
    removeFactFromAllReferenceMarker: () =>
        console.error(
            "ReferenceMarkerProvider not found or has not been set up",
        ),
    getCurSelectedFacts: () => {
        console.error(
            "ReferenceMarkerProvider not found or has not been set up",
        );
        return [];
    },
    getInputFieldContent: () => {
        console.error(
            "ReferenceMarkerProvider not found or has not been set up",
        );
        return "";
    },
});
