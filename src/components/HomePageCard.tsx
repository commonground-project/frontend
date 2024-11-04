type HomePageCardProps = {
    issues: Array<{ id: number; title: string; description: string }>;
};

export default function HomePageCard({ issues }: HomePageCardProps) {
    return (
        <div className="w-7/12 rounded-md bg-neutral-100 p-5 text-black">
            {issues.map((issue, index) => (
                <div key={index}>
                    <h1 className="py-1 text-lg font-semibold">
                        {issue.title}
                    </h1>
                    <p className="text-base font-normal">{issue.description}</p>
                    {index !== issues.length - 1 && (
                        <hr className="my-4 border-gray-500" />
                    )}
                </div>
            ))}
        </div>
    );
}
