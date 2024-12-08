import { Fact } from "@/types/conversations.types";
import { Button } from "@mantine/core";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type FactCardProps = {
    fact: Fact;
    removeFact: (id: string) => void;
};

export default function EditViewpointFact({ fact, removeFact }: FactCardProps) {
    return (
        <div>
            <div className="group flex">
                <h1 className="float-left text-lg font-normal text-black">
                    {fact.title}
                </h1>
                <Button
                    variant="transparent"
                    classNames={{
                        root: "float-right pr-1 pl-0 flex invisible group-hover:visible",
                    }}
                    onClick={() => removeFact(String(fact.id))}
                >
                    <XMarkIcon className="size-6 stroke-black hover:stroke-red-600" />
                </Button>
            </div>
            {fact.references.map((reference) => (
                <div key={reference.id} className="mt-1">
                    <Link
                        href={reference.url}
                        passHref
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-full bg-neutral-200 px-3"
                    >
                        <img className="h-4 w-4" src={reference.icon} alt="" />
                        <h1 className="text-sm font-normal text-neutral-500">
                            {new URL(reference.url).hostname}
                        </h1>
                        <h1 className="text-sm font-normal text-neutral-500">
                            {reference.title}
                        </h1>
                    </Link>
                </div>
            ))}
        </div>
    );
}
