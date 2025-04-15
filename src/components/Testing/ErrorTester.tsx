// This component is only for testing error boundaries
// It will throw an error when the button is clicked
// This component should not be used in production
import { useState } from "react";

export default function ErrorTester() {
    const [shouldThrow, setShouldThrow] = useState(false);

    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    if (shouldThrow) {
        throw new Error("This is a test error");
    }

    return (
        <div className="rounded-lg border-2 border-red-500 bg-red-200 p-4">
            <button
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
                onClick={() => setShouldThrow(true)}
            >
                press me the throw an error
            </button>
        </div>
    );
}
