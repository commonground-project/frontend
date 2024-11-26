import { Input } from "@mantine/core";

type NicknameInputProps = {
    nickname: string;
    setNickname: (nickname: string) => void;
};

export default function NicknameInput({
    nickname,
    setNickname,
}: NicknameInputProps) {
    return (
        <Input.Wrapper
            required
            label="暱稱"
            description="我們該如何稱呼您？"
            classNames={{
                root: "w-full max-w-[430px] pb-[30px]",
                label: "pb-1 text-[16px] font-semibold text-neutral-900",
                description: "pb-2 text-[14px] font-normal text-[#868E96]",
            }}
        >
            <Input
                required
                value={nickname}
                onChange={(e) => setNickname(e.currentTarget.value)}
                classNames={{
                    input: "bg-transparent px-4 py-[6px] text-[16px] font-normal",
                }}
            />
        </Input.Wrapper>
    );
}
