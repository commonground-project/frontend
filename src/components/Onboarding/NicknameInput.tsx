import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type NicknameInputProps = {
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

export default function NicknameInput({
    form,
    inputValueName,
}: NicknameInputProps) {
    return (
        <TextInput
            label="暱稱"
            description="我們該如何稱呼您？"
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
