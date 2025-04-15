// This component is only for testing error boundaries
// It will throw an error when the button is clicked
// This component should not be used in production

export default function ErrorTester() {
    if (process.env.NODE_ENV !== "development") {
        return null;
    }

    return (
        <div className="rounded-lg border-2 border-red-500 bg-red-200 p-4">
            <button
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
                onClick={() => {
                    throw new Error("This is a test error");
                }}
            >
                press me the throw an error
            </button>
        </div>
    );
}
