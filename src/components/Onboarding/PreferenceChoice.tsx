import {
    OnboardingInterests,
    type InterestStatus,
} from "@/lib/onboarding/forms";
import { Button } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";

interface PreferenceChoiceProps {
    form: UseFormReturnType<{ [key: string]: InterestStatus }>;
    setAllowNextStep?: (allow: boolean) => void;
}

export default function PreferenceChoice({
    form,
    setAllowNextStep,
}: PreferenceChoiceProps) {
    const [latestSelected, setLatestSelected] = useState<number>(-1);

    useEffect(() => {
        if (!setAllowNextStep) return;
        setAllowNextStep(latestSelected >= OnboardingInterests.length - 1);
    }, [form.values, latestSelected, setAllowNextStep]);

    return (
        <div className="flex flex-col gap-4">
            {OnboardingInterests.map((interest, index) => (
                <div className="w-full" key={interest.id}>
                    <div className="rounded-md border border-neutral-200 bg-white p-4">
                        <div className="flex items-center gap-1.5">
                            <div className="h-4 w-4 rounded-full bg-neutral-200" />
                            <p className="text-sm text-neutral-900">
                                {interest.username}
                            </p>
                        </div>
                        <p className="mt-1 leading-7">{interest.content}</p>
                        <div className="mt-1 flex items-center gap-2 md:justify-end">
                            <Button
                                className="w-1/2 md:w-36"
                                size="md"
                                variant={
                                    form.values[interest.id] === "DISINTEREST"
                                        ? "filled"
                                        : "outline"
                                }
                                onClick={() => {
                                    setLatestSelected(index);
                                    form.setFieldValue(
                                        interest.id,
                                        "DISINTEREST",
                                    );
                                }}
                                disabled={latestSelected < index - 1}
                            >
                                沒有興趣
                            </Button>
                            <Button
                                className="w-1/2 md:w-36"
                                size="md"
                                variant={
                                    form.values[interest.id] === "INTEREST"
                                        ? "filled"
                                        : "outline"
                                }
                                onClick={() => {
                                    setLatestSelected(index);
                                    form.setFieldValue(interest.id, "INTEREST");
                                }}
                                disabled={latestSelected < index - 1}
                            >
                                推薦更多
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
