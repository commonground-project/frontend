import { useEffect } from "react";
import { TextInput, Select, NumberInput } from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import {
    type OnboardingUserInfo,
    OnboardingOccupations,
} from "@/lib/onboarding/forms";

interface GatherInfoProps {
    form: UseFormReturnType<OnboardingUserInfo>;
    setAllowNextStep?: (allow: boolean) => void;
}

export default function GatherInfo({
    form,
    setAllowNextStep,
}: GatherInfoProps) {
    useEffect(() => {
        if (!setAllowNextStep) return;
        setAllowNextStep(form.isValid());
    }, [form, setAllowNextStep]);

    return (
        <form className="flex w-full flex-col gap-8">
            <TextInput
                label="取個令人印象深刻的 ID 吧"
                description="請使用英文字母、數字或半形句點、底線與減號"
                placeholder="獨一無二的使用者名稱"
                error={form.errors.username}
                {...form.getInputProps("username")}
            />
            <TextInput
                label="您的暱稱"
                description="我們該如何稱呼您？"
                placeholder="其他使用者看到的名字"
                error={form.errors.nickname}
                {...form.getInputProps("nickname")}
            />
            <NumberInput
                label="您的出生年"
                placeholder="例如：2000"
                min={1900}
                max={new Date().getFullYear()}
                error={form.errors.birthYear}
                {...form.getInputProps("birthYear")}
            />
            <Select
                label="您的性別"
                placeholder="請選擇您的性別"
                error={form.errors.gender}
                data={[
                    { value: "male", label: "男性" },
                    { value: "female", label: "女性" },
                    { value: "other", label: "其他" },
                    { value: "preferNotToSay", label: "不願意透露" },
                ]}
                {...form.getInputProps("gender")}
            />
            <Select
                label="您的職業"
                description="幫助我們更精準的推薦您可能有興趣的議題"
                placeholder="請選擇您的職業"
                error={form.errors.occupation}
                data={OnboardingOccupations}
                {...form.getInputProps("occupation")}
            />
        </form>
    );
}
