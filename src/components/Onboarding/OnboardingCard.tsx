"use client";
import { useState, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function OnboardingCard() {
    const userNameSchema = /^[a-zA-Z0-9._-]*$/;

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            username: "",
            nickname: "",
        },
        validate: {
            username: (value) =>
                userNameSchema.test(value)
                    ? null
                    : "存在不允許的字元，請使用英文字母、數字或半形句點、底線與減號",
        },
    });

    const [submittedValues, setSubmittedValues] = useState<
        typeof form.values | null
    >(null);

    useEffect(() => {
        if (submittedValues) {
            console.log("Submitted values:", submittedValues);
            window.location.href = "/";
        }
    }, [submittedValues, setSubmittedValues]);

    return (
        <div className="w-full max-w-3xl rounded-lg bg-neutral-100 px-6 py-5">
            <h1 className="mb-4 text-2xl font-semibold text-neutral-900">
                歡迎來到 CommonGround
            </h1>
            <form onSubmit={form.onSubmit(setSubmittedValues)}>
                <TextInput
                    label="使用者名稱"
                    description="您在平台上的 ID；請使用英文字母、數字或半形句點、底線與減號"
                    required
                    {...form.getInputProps("nickname")}
                    key={form.key("nickname")}
                    size="md"
                    classNames={{
                        root: "w-full max-w-[430px] pb-[30px]",
                        //     label: "pb-1 text-[16px] font-semibold text-neutral-900",
                        //     description: `pb-2 text-[14px] font-normal text-[#868E96]"`,
                        //     input: "bg-transparent px-4 py-[6px] text-[16px] font-normal",
                    }}
                />
                <TextInput
                    label="使用者名稱"
                    description="您在平台上的 ID；請使用英文字母、數字或半形句點、底線與減號"
                    required
                    {...form.getInputProps("username")}
                    key={form.key("username")}
                    classNames={{
                        root: "w-full max-w-[430px] pb-[30px]",
                        label: "pb-1 text-[16px] font-semibold text-neutral-900",
                        description: `pb-2 text-[14px] font-normal text-[#868E96]"`,
                        input: "bg-transparent px-4 py-[6px] text-[16px] font-normal",
                    }}
                />
                <Button
                    type="submit"
                    color="#2563eb"
                    rightSection={
                        <PaperAirplaneIcon className="size-4 stroke-white" />
                    }
                    size="sm"
                >
                    開始使用
                </Button>
            </form>
        </div>
    );
}
