import { UserRepresentation } from "@/types/users.types";

type AvatarProps = {
    user: UserRepresentation;
};

export default function Avatar({ user }: AvatarProps) {
    return (
        <div className="flex items-center">
            <img
                className="inline-block h-4 w-4 rounded-full"
                src={user.avatar}
                alt="userimage"
            />
            <h1 className="ml-2 inline-block text-xs font-normal text-neutral-600">
                {user.username}
            </h1>
        </div>
    );
}
