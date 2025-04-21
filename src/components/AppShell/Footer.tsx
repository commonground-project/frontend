import {
    UserCircleIcon as UserCircleIconOutline,
    PencilSquareIcon as PencilSquareIconOutline,
    HomeIcon as HomeIconOutline,
} from "@heroicons/react/24/outline";
import {
    UserCircleIcon as UserCircleIconSolid,
    PencilSquareIcon as PencilSquareIconSolid,
    HomeIcon as HomeIconSolid,
} from "@heroicons/react/24/solid";
import { ActionIcon } from "@mantine/core";
import Link from "next/link";

type FooterProps = {
    HomeIconVariant?: "solid" | "outline" | "none";
    PencilIconVariant?: "solid" | "outline" | "none";
    UserIconVariant?: "solid" | "outline" | "none";
};

export default function Footer({
    HomeIconVariant = "outline",
    PencilIconVariant = "outline",
    UserIconVariant = "outline",
}: FooterProps) {
    return (
        <div className="flex h-16 w-full justify-evenly bg-white pb-6 pt-2">
            {HomeIconVariant !== "none" && (
                <ActionIcon variant="transparent" className="size-8">
                    <Link href="/">
                        {HomeIconVariant === "solid" ? (
                            <HomeIconSolid className="size-8 text-black" />
                        ) : (
                            <HomeIconOutline className="size-8 text-black" />
                        )}
                    </Link>
                </ActionIcon>
            )}

            {PencilIconVariant !== "none" && (
                <ActionIcon variant="transparent" className="size-8">
                    {PencilIconVariant === "solid" ? (
                        <PencilSquareIconSolid className="size-8 text-black" />
                    ) : (
                        <PencilSquareIconOutline className="size-8 text-black" />
                    )}
                </ActionIcon>
            )}
            {UserIconVariant !== "none" && (
                <ActionIcon variant="transparent" className="size-8">
                    {UserIconVariant === "solid" ? (
                        <UserCircleIconSolid className="size-8 text-black" />
                    ) : (
                        <UserCircleIconOutline className="size-8 text-black" />
                    )}
                </ActionIcon>
            )}
        </div>
    );
}
