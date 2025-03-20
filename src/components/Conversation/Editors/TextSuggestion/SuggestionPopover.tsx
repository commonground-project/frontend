import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    BellSlashIcon,
} from "@heroicons/react/24/outline";
import { ActionIcon } from "@mantine/core";
import type { TextSuggestion } from "@/lib/requests/suggestions/textSuggestion";

type SuggestionPopoverProps = {
    show: boolean;
    target: HTMLElement;
    suggestionMessage: TextSuggestion;
};

export default function SuggestionPopover({
    show,
    target,
    suggestionMessage,
}: SuggestionPopoverProps) {
    const targetRect = target.getBoundingClientRect();
    const posX = targetRect.left + targetRect.width / 2;
    const posY = targetRect.top + targetRect.height;

    return (
        <div
            className={`absolute rounded-md bg-white p-3 ${show ? "opacity-100" : "opacity-0"} flex w-56 flex-col gap-1 shadow-xl transition-opacity duration-500`}
            style={{ top: posY, left: posX }}
        >
            <div className="flex text-[10px] text-neutral-500">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                >
                    <circle cx="6" cy="6" r="2" fill="#F59E0B" />
                </svg>
                用詞提醒
            </div>
            <div className="text-xs">{suggestionMessage.feedback}</div>
            <div className="flex gap-1">
                <ActionIcon variant="transparent" size={18}>
                    <HandThumbUpIcon className="text-neutral-500" />
                </ActionIcon>
                <ActionIcon variant="transparent" size={18}>
                    <HandThumbDownIcon className="text-neutral-500" />
                </ActionIcon>
                <ActionIcon variant="transparent" size={18}>
                    <BellSlashIcon className="text-neutral-500" />
                </ActionIcon>
            </div>
        </div>
    );
}
