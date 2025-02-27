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
    const formatTimeAgo = (date: Date) => {
        const now = new Date(); // Get current local time
        console.log("now", now);
        console.log("date", date);
        const diffInSeconds = Math.floor(
            (now.getTime() - date.getTime()) / 1000,
        );
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSeconds < 60) return "剛剛";
        if (diffInMinutes < 60) return `${diffInMinutes} 分鐘前`;
        if (diffInHours < 24) return `${diffInHours} 小時前`;
        if (diffInDays < 7) return `${diffInDays} 天前`;

        // Show absolute date if older than a week
        return date.toLocaleDateString();
    };

    return (
        <div className="mb-1 flex">
            <Avatar
                name={authorName}
                src={process.env.NEXT_PUBLIC_BACKEND_URL + authorAvatar}
                alt=""
                size="1rem"
            />
            <p className="ml-1.5 inline-block text-xs font-normal text-neutral-600">
                {authorName}
            </p>
            {createdAt && (
                <p className="ml-3 inline-block text-xs font-normal text-neutral-600">
                    {formatTimeAgo(createdAt)}
                </p>
            )}
        </div>
    );
}
