export default function HomePagePulseCard() {
    return (
        <div className="w-full max-w-3xl rounded-md bg-neutral-100 px-7 py-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="animate-pulse">
                    <div className="h-6 bg-neutral-300 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-neutral-300 rounded w-full mb-1" />
                    <div className="h-4 bg-neutral-300 rounded w-2/3" />
                    
                    {index !== 3 && (
                        <div className="my-3 border-neutral-300 border-t" />
                    )}
                </div>
            ))}
        </div>
    );
}