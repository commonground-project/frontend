"use client";
import { useEffect, useState } from "react";
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
    const [displayedTimeString, setDisplayedTimeString] = useState<string>("");

    useEffect(() => {
        if (!createdAt) return;

        const now = new Date(); // Get current local time
        const diffInSeconds = Math.floor(
            (now.getTime() - createdAt.getTime()) / 1000,
        );
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSeconds < 60) setDisplayedTimeString("剛剛");
        else if (diffInMinutes < 60)
            setDisplayedTimeString(`${diffInMinutes} 分鐘前`);
        else if (diffInHours < 24)
            setDisplayedTimeString(`${diffInHours} 小時前`);
        else if (diffInDays < 7) setDisplayedTimeString(`${diffInDays} 天前`);
        // Show absolute date if older than a week
        else setDisplayedTimeString(createdAt.toLocaleDateString());
    }, []);

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

            <p className="ml-3 inline-block text-xs font-normal text-neutral-600">
                {displayedTimeString}
            </p>
        </div>
    );
}
