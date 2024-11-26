/* eslint-disable @next/next/no-img-element */
"use client";

import { Fact } from "@/types/conversations.types";
import { mockIssue } from "@/mock/conversationMock";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type AllFactsCardProps = {
    facts: Fact[];
    issueId: string;
};

export default function AllFactsCard({ facts }: AllFactsCardProps) {
    return (
        <div className="mb-6 w-full max-w-3xl rounded-md bg-neutral-100 p-5 text-black">
            {/* Title */}
            <h1 className="py-1 font-sans text-2xl font-bold">
                {mockIssue.title}
            </h1>

            {/* Facts Section */}
            <div className="mt-3">
                <h2 className="mb-1 text-lg font-semibold text-black">
                    所有事實
                </h2>
                {facts.map((fact) => (
                    <div key={fact.id} className="mb-2">
                        <p className="mb-2 text-lg text-black">
                            {fact.title}
                        </p>
                        <div className="space-y-1">
                            {fact.references.map((reference) => (
                                <Link
                                    key={reference.id}
                                    href={reference.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-full bg-gray-200/50 p-[0.3%] hover:bg-gray-200"
                                >
                                    <img
                                        className="ml-2 h-3 w-3 rounded-full"
                                        src={reference.icon}
                                        alt=""
                                    />
                                    <div className="flex items-center gap-x-2">
                                        <span className="font-sans text-xs font-normal text-neutral-500">
                                            {reference.url.replace(
                                                /(https?:\/\/)?(www\.)?/,
                                                "",
                                            )}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {reference.title.length > 94 ? `${reference.title.slice(0, 94)}...` : reference.title}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Fact Button */}
            <Link
                href=""
                className="mt-4 flex cursor-pointer items-center gap-1 font-sans font-bold text-black"
            >
                <PlusIcon className="h-5 w-5" />
                <span>新增事實</span>
            </Link>
        </div>
    );
}
