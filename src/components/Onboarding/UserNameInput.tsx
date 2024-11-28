import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type UserNameInputProps = {
    form: UseFormReturnType<
        {
            username: string;
            nickname: string;
        },
        (values: { username: string; nickname: string }) => {
            username: string;
            nickname: string;
        }
    >;
    inputValueName: string;
};

export default function UserNameInput({
    form,
    inputValueName,
}: UserNameInputProps) {
    return (
        <TextInput
            label="使用者名稱"
            description="您在平台上的 ID；請使用英文字母、數字或半形句點、底線與減號"
            required
            {...form.getInputProps(inputValueName)}
            key={form.key(inputValueName)}
            classNames={{
                root: "w-full max-w-[430px] pb-[30px]",
                label: "pb-1 text-[16px] font-semibold text-neutral-900",
                description: `pb-2 text-[14px] font-normal text-[#868E96]"`,
                input: "bg-transparent px-4 py-[6px] text-[16px] font-normal",
            }}
        />
    );
}
