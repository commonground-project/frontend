"use client";

import { useMemo, useState, type JSX } from "react";

import { useCookies } from "react-cookie";
import { Button, Progress } from "@mantine/core";
import { motion } from "motion/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

import { useForm, type UseFormReturnType, zodResolver } from "@mantine/form";
import {
    onboardingUserInfoSchema,
    type OnboardingUserInfo,
    type OnboardingInterests,
    type OnboardingNotificationPreferences,
} from "@/lib/onboarding/forms";
import { subscribeWebPush } from "@/lib/requests/settings/postSubscribe";

import GatherInfo from "@/components/Onboarding/GatherInfo";
import IntroducePlatform from "@/components/Onboarding/IntroducePlatform";
import PreferenceChoice from "@/components/Onboarding/PreferenceChoice";
import NotificationPermissions from "@/components/Onboarding/NotificationPermissions";
import BeforeWeStart from "@/components/Onboarding/BeforeWeStart";

export default function OnboardingPage() {
    const [cookies] = useCookies(["auth_token", "auth_refresh_token"]);
    const [currentScreen, setCurrentScreen] = useState<number>(0);
    const [isNextStepEnabled, setIsNextStepEnabled] = useState<boolean>(false);
    const [nextStepLoading, setNextStepLoading] = useState<boolean>(false);

    const infoForm = useForm<OnboardingUserInfo>({
        initialValues: {
            username: "",
            nickname: "",
            birthYear: null,
            gender: null,
            occupation: null,
        },
        validate: zodResolver(onboardingUserInfoSchema),
    });

    const interestsForm = useForm<OnboardingInterests>({
        initialValues: {},
        validate: (values) => {
            const errors: Record<string, string | null> = {};
            Object.keys(values).forEach((key) => {
                if (!values[key]) errors[key] = "請選擇對此議題的興趣";
            });
            return errors;
        },
    });

    const notificationForm = useForm<OnboardingNotificationPreferences>({
        initialValues: {
            pushNotifications: false,
        },
    });

    const onboardingScreens = useMemo<
        {
            title: string | JSX.Element;
            element: (props: any) => JSX.Element;
            form?: UseFormReturnType<any>;
            completeCallback?: () => Promise<void>;
        }[]
    >(
        () => [
            {
                title: "首先，讓我們更了解你",
                element: GatherInfo,
                form: infoForm,
                completeCallback: async () => {
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                },
            },
            {
                title: (
                    <>
                        {" "}
                        更加瞭解
                        <span className="text-emerald-600">COMMONGROUND</span>
                    </>
                ),
                element: IntroducePlatform,
            },
            {
                title: "讓我們知道你對什麼感興趣",
                element: PreferenceChoice,
                form: interestsForm,
            },
            {
                title: "通知設定",
                element: NotificationPermissions,
                form: notificationForm,
                completeCallback: async () => {
                    if (
                        cookies.auth_token &&
                        notificationForm.values.pushNotifications
                    ) {
                        await subscribeWebPush({
                            auth_token: cookies.auth_token,
                        });
                    }
                },
            },
            {
                title: "歡迎使用 COMMONGROUND",
                element: BeforeWeStart,
            },
        ],
        [infoForm, interestsForm, notificationForm, cookies.auth_token],
    );

    const handleNextStep = () => {
        if (onboardingScreens[currentScreen].form) {
            const result = onboardingScreens[currentScreen].form.validate();
            if (result.hasErrors) return;
        }

        if (onboardingScreens[currentScreen].completeCallback) {
            setNextStepLoading(true);
            onboardingScreens[currentScreen]
                .completeCallback()
                .then(() => {
                    setCurrentScreen(currentScreen + 1);
                })
                .finally(() => {
                    setNextStepLoading(false);
                });
        } else {
            setCurrentScreen(currentScreen + 1);
        }
    };

    return (
        <main className="relative flex h-screen w-screen items-center justify-center bg-neutral-50">
            <div className="hidden h-full items-center justify-end md:flex md:w-[50vw]">
                <img src="/assets/CGGradient.jpeg" className="h-full" alt="" />
            </div>
            <div className="flex h-full w-full justify-center overflow-hidden pb-12 pt-20 md:w-[50vw] md:items-center md:pt-0">
                <div className="mx-8 flex h-full w-full flex-col justify-around md:mx-20 md:max-h-[67vh]">
                    <div className="relative h-full w-full">
                        {onboardingScreens.map((screen, i) => (
                            <motion.div
                                className="absolute top-0 h-full w-full"
                                key={i}
                                initial={{
                                    translateX: `100vw`,
                                }}
                                animate={{
                                    translateX: `${(currentScreen - i) * -100}vw`,
                                    transition: {
                                        type: "spring",
                                        bounce: 0,
                                        duration: 0.5,
                                    },
                                }}
                            >
                                <h1 className="text-2xl font-semibold md:text-4xl">
                                    {screen.title}
                                </h1>
                                <div className="my-9 h-[calc(100%-112px)] overflow-y-auto">
                                    {/* 112px = 48px (title) + 36 * 2px (margins) */}
                                    <screen.element
                                        form={screen.form ?? undefined}
                                        setAllowNextStep={
                                            currentScreen === i
                                                ? setIsNextStepEnabled
                                                : undefined
                                        }
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="w-full">
                        <Progress
                            value={Math.max(4, (currentScreen / 4) * 100)}
                        />
                        <div className="ml-auto mt-6 flex w-full max-w-sm items-center justify-end">
                            {currentScreen >= 1 && (
                                <Button
                                    className="min-w-[33%] rounded-lg"
                                    size="md"
                                    leftSection={
                                        <ArrowLeftIcon className="w-6" />
                                    }
                                    variant="subtle"
                                    onClick={() =>
                                        setCurrentScreen(currentScreen - 1)
                                    }
                                >
                                    上一步
                                </Button>
                            )}
                            <Button
                                className="ml-5 min-w-[calc(7/12*100%)] rounded-lg"
                                size="md"
                                rightSection={
                                    currentScreen === 4 ? (
                                        <img
                                            src="/assets/logo-white.svg"
                                            className="h-6"
                                            alt=""
                                        />
                                    ) : (
                                        <ArrowRightIcon className="w-6" />
                                    )
                                }
                                variant="filled"
                                color="emerald"
                                disabled={!isNextStepEnabled}
                                onClick={handleNextStep}
                                loading={nextStepLoading}
                            >
                                {currentScreen === 4 ? "開始使用" : "下一步"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
