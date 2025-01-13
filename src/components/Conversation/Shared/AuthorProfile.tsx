import { Avatar } from "@mantine/core";

type AuthorProfileProps = {
    authorName: string;
    authorAvatar: string;
    createdAt?: Date;
};

export default function AuthorProfile({
    authorName,
    authorAvatar,
    createdAt,
}: AuthorProfileProps) {
    return (
        <div className="mb-1 flex">
            <Avatar name={authorName} src={authorAvatar} alt="" size="1rem" />
            <p className="ml-1.5 inline-block text-xs font-normal text-neutral-600">
                {authorName}
            </p>
            {createdAt && (
                <p className="ml-3 inline-block text-xs font-normal text-neutral-600">
                    {createdAt.toLocaleDateString()}
                </p>
            )}
        </div>
    );
}
