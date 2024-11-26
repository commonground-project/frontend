"use client";
import { useState } from "react";
import NicknameInput from "@/components/Onboarding/NicknameInput";
import UserNameInput from "./UserNameInput";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Metadata } from "next";
import { Button } from "@mantine/core";

export const metadata: Metadata = {
    title: "CommonGround - Onboarding",
    keywords: "onboarding, user, registration",
    description: "CommonGround onboarding page for new users",
};

export default function OnboardingCard() {
    const [userName, setUserName] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("User name:", userName);
        console.log("Nickname:", nickname);
        window.location.href = "/";
    };

    return (
        <div className="w-full max-w-3xl rounded-lg bg-neutral-100 px-6 py-5">
            <h1 className="mb-4 text-2xl font-semibold text-neutral-900">
                歡迎來到 CommonGround
            </h1>
            <form onSubmit={onSubmit}>
                <NicknameInput nickname={nickname} setNickname={setNickname} />
                <UserNameInput userName={userName} setUserName={setUserName} />
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
