type NicknameInputProps = {
    nickname: string;
    setNickname: (nickname: string) => void;
};

export default function NicknameInput({
    nickname,
    setNickname,
}: NicknameInputProps) {
    return (
        <div className="pb-[30px]">
            <label className="pb-1 text-[16px] font-semibold">
                <h1 className="inline text-neutral-900">暱稱</h1>
                <h1 className="inline text-red-500">*</h1>
            </label>
            <h2 className="pb-2 text-[14px] font-normal text-[#868E96]">
                我們該如何稱呼您？
            </h2>
            <input
                type="text"
                className="w-full max-w-[430px] rounded-sm border-[1px] border-gray-300 bg-transparent px-4 py-[6px]"
                title="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
        </div>
    );
}
