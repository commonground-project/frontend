import { useEffect } from "react";
import {
    ChatBubbleLeftRightIcon,
    NewspaperIcon,
    RectangleStackIcon,
} from "@heroicons/react/24/outline";

interface IntroducePlatformProps {
    setAllowNextStep?: (allow: boolean) => void;
}

export default function IntroducePlatform({
    setAllowNextStep,
}: IntroducePlatformProps) {
    useEffect(() => {
        if (!setAllowNextStep) return;
        setAllowNextStep(true);
    }, [setAllowNextStep]);

    return (
        <div className="flex flex-col gap-5">
            <div>
                <div className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-200">
                        <NewspaperIcon className="w-6 text-emerald-600" />
                    </div>
                    <h2 className="ml-3 text-xl font-medium md:text-2xl">
                        議題
                    </h2>
                </div>

                <p className="mt-3 text-lg md:text-xl">
                    CommonGround
                    的討論由議題組成，議題下會匯聚所有相關的討論，並提供 AI
                    生成的議題縱覽。
                </p>
            </div>
            <div>
                <div className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-200">
                        <RectangleStackIcon className="w-6 text-emerald-600" />
                    </div>
                    <h2 className="ml-3 text-xl font-medium md:text-2xl">
                        事實
                    </h2>
                </div>
                <p className="mt-3 text-lg md:text-xl">
                    事實是 CommonGround
                    討論的基石。在論述想法時，引註事實可以讓觀點更加明確清晰。
                </p>
            </div>
            <div>
                <div className="flex items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-200">
                        <ChatBubbleLeftRightIcon className="w-6 text-emerald-600" />
                    </div>
                    <h2 className="ml-3 text-xl font-medium md:text-2xl">
                        觀點
                    </h2>
                </div>
                <p className="mt-3 text-lg md:text-xl">
                    觀點是議題的某個討論面向，同時作為定義議題的切入點，與讓作者發表想法用。觀點下的回覆將以觀點提及的面向出發，進行多方思辨與討論。
                </p>
            </div>
        </div>
    );
}
