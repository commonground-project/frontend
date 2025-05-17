import { useEffect, useState } from "react";
import {
    type BeforeWeStartForm,
    BeforeWeStartItems,
} from "@/lib/onboarding/forms";
import { Checkbox, Stack } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";

interface BeforeWeStartProps {
    form?: UseFormReturnType<BeforeWeStartForm>;
    setAllowNextStep?: (allow: boolean) => void;
}

export default function BeforeWeStart({
    form,
    setAllowNextStep,
}: BeforeWeStartProps) {
    const [acceptedItems, setAcceptedItems] = useState<boolean[]>(
        new Array(BeforeWeStartItems.length).fill(false),
    );

    useEffect(() => {
        if (!setAllowNextStep) return;
        setAllowNextStep(acceptedItems.every((item) => item));
    }, [acceptedItems, setAllowNextStep]);

    return (
        <Stack gap="lg">
            <p className="text-base md:text-lg">
                在
                CommonGround，我們期待能營造一個讓彼此能舒適的討論的社群。為了確保彼此都能暢所欲言，請同意以下行為守則：
            </p>
            {BeforeWeStartItems.map((message, index) => (
                <Checkbox
                    size="md"
                    key={index}
                    label={message}
                    {...form?.getInputProps(`${message}`, {
                        type: "checkbox",
                    })}
                    onChange={(e) => {
                        setAcceptedItems(
                            acceptedItems.map((cur, i) =>
                                i === index ? e.currentTarget.checked : cur,
                            ),
                        );
                    }}
                />
            ))}
        </Stack>
    );
}
