export default function HomePagePulseCard() {
    return (
        <div className="w-full max-w-3xl rounded-md bg-neutral-100 px-7 py-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="animate-pulse">
                    <div className="mb-2 h-6 w-3/4 rounded bg-neutral-300" />
                    <div className="mb-1 h-4 w-full rounded bg-neutral-300" />
                    <div className="h-4 w-2/3 rounded bg-neutral-300" />

                    {index !== 3 && (
                        <div className="my-3 border-t border-neutral-300" />
                    )}
                </div>
            ))}
        </div>
    );
}
