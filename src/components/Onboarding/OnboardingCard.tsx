"use client";
import { useState } from "react";
import NicknameInput from "@/components/Onboarding/NicknameInput";
import UserNameInput from "./UserNameInput";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function OnboardingCard() {
    const [userName, setUserName] = useState<string>("");
    const [nickname, setNickname] = useState<string>("");

    return (
        <div className="w-full max-w-3xl rounded-lg bg-neutral-100 px-6 py-5">
            <h1 className="mb-4 text-2xl font-semibold text-neutral-900">
                歡迎來到 CommonGround
            </h1>
            <form onSubmit={() => console.log("submit form")}>
                <NicknameInput nickname={nickname} setNickname={setNickname} />
                <UserNameInput userName={userName} setUserName={setUserName} />

                <button
                    type="submit"
                    className="flex h-6 w-[84px] items-center justify-center gap-1 rounded-[4px] bg-blue-600 px-2 py-1"
                >
                    <h2 className="text-xs font-normal text-white">開始使用</h2>
                    <PaperAirplaneIcon className="size-4 stroke-white" />
                </button>
            </form>
        </div>
    );
}
