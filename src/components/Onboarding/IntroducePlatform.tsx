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
                    Lorem ipsum dolor sit amet consectetur. At vel rhoncus lorem
                    id urna turpis sed. Habitasse nisl aenean mattis augue
                    lacus. Dolor sollicitudin orci ullamcorper id massa risus
                    ante.
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
                    Lorem ipsum dolor sit amet consectetur. At vel rhoncus lorem
                    id urna turpis sed. Habitasse nisl aenean mattis augue
                    lacus. Dolor sollicitudin orci ullamcorper id massa risus
                    ante.
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
                    Lorem ipsum dolor sit amet consectetur. At vel rhoncus lorem
                    id urna turpis sed. Habitasse nisl aenean mattis augue
                    lacus. Dolor sollicitudin orci ullamcorper id massa risus
                    ante.
                </p>
            </div>
        </div>
    );
}
