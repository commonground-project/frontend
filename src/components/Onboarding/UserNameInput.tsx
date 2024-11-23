"use client";
import { useState } from "react";

type UserNameInputProps = {
    userName: string;
    setUserName: (userName: string) => void;
};

export default function UserNameInput({
    userName,
    setUserName,
}: UserNameInputProps) {
    const [valid, setValid] = useState<boolean>(true);

    const userNamePattern = /^[a-zA-Z0-9._-]*$/;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserName(value);
        setValid(userNamePattern.test(value));
    };
    return (
        <div className="pb-[30px]">
            <label className="pb-1 text-[16px] font-semibold">
                <h1 className="inline text-neutral-900">使用者名稱</h1>
                <h1 className="inline text-red-500">*</h1>
            </label>
            <h2
                className={`pb-2 text-[14px] font-normal ${valid ? "text-[#868E96]" : "text-red-500"}`}
            >
                您在平台上的 ID；請使用英文字母、數字或半形句點、底線與減號
            </h2>
            <input
                type="text"
                className={`w-full max-w-[430px] rounded-sm border-[1px] ${valid ? "border-gray-300" : "border-red-500 focus:outline-red-500"} bg-transparent px-4 py-[6px]`}
                placeholder="您的使用者名稱"
                value={userName}
                onChange={handleInputChange}
                pattern="^[a-zA-Z0-9._-]+$"
                title="username"
            />
        </div>
    );
}
