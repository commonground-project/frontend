"use client";
import { useState, useEffect } from "react";
import NicknameInput from "@/components/Onboarding/NicknameInput";
import UserNameInput from "./UserNameInput";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";
import { Button } from "@mantine/core";
import { useForm } from "@mantine/form";

export const metadata: Metadata = {
    title: "CommonGround - Onboarding",
    keywords: "onboarding, user, registration",
    description: "CommonGround onboarding page for new users",
};

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
                <NicknameInput form={form} inputValueName="nickname" />
                <UserNameInput form={form} inputValueName="username" />
                <Button
                    type="submit"
                    color="#2563eb"
                    rightSection={
                        <PaperAirplaneIcon className="size-4 stroke-white" />
                    }
                    classNames={{
                        root: "p-0 h-6 w-[84px] text-xs font-normal text-white",
                        section: "ml-1",
                    }}
                >
                    開始使用
                </Button>
            </form>
        </div>
    );
}
