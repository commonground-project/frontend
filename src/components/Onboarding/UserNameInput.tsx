"use client";
import { useState } from "react";
import { Input } from "@mantine/core";
import { z } from "zod";

type UserNameInputProps = {
    userName: string;
    setUserName: (userName: string) => void;
};

export default function UserNameInput({
    userName,
    setUserName,
}: UserNameInputProps) {
    const [valid, setValid] = useState<boolean>(true);

    const userNameSchema = z.string().regex(/^[a-zA-Z0-9._-]*$/);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserName(value);
        try {
            userNameSchema.parse(value);
            setValid(true);
        } catch {
            setValid(false);
        }
    };
    return (
        <Input.Wrapper
            required
            label="使用者名稱"
            description="您在平台上的 ID；請使用英文字母、數字或半形句點、底線與減號"
            error={
                valid
                    ? null
                    : "存在不允許的字元，請使用英文字母、數字或半形句點、底線與減號"
            }
            classNames={{
                root: "w-full max-w-[430px] pb-[30px]",
                label: "pb-1 text-[16px] font-semibold text-neutral-900",
                description: `pb-2 text-[14px] font-normal ${valid ? "text-[#868E96]" : "text-red-500"}`,
            }}
        >
            <Input
                required
                value={userName}
                onChange={handleInputChange}
                classNames={{
                    input: `bg-transparent px-4 py-[6px] text-[16px] font-normal ${valid ? "" : "border-red-500 focus:outline-red-500"}`,
                }}
            />
        </Input.Wrapper>
    );
}
