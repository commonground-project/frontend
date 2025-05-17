"use client";

import { useContext, useMemo, useState, type JSX } from "react";

import { toast } from "sonner";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button, Progress } from "@mantine/core";
import { motion } from "motion/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

import { useForm, type UseFormReturnType, zodResolver } from "@mantine/form";
import {
    onboardingUserInfoSchema,
    type OnboardingUserInfo,
    type OnboardingInterests,
    type OnboardingNotificationPreferences,
    type OnboardingUserInfoComplete,
} from "@/lib/onboarding/forms";
import { subscribeWebPush } from "@/lib/requests/settings/postSubscribe";

import { AuthContext } from "@/lib/auth/authContext";
import { setupUserRequest } from "@/lib/requests/users/setupUser";
import {
    postViewpointPreference,
    type PostViewpointPreferenceParams,
} from "@/lib/requests/viewpoints/postViewpointPreference";

import GatherInfo from "@/components/Onboarding/GatherInfo";
import IntroducePlatform from "@/components/Onboarding/IntroducePlatform";
import PreferenceChoice from "@/components/Onboarding/PreferenceChoice";
import NotificationPermissions from "@/components/Onboarding/NotificationPermissions";
import BeforeWeStart from "@/components/Onboarding/BeforeWeStart";
import { completeOnboardingRequest } from "@/lib/requests/users/completeOnboarding";
import { refreshJwtRequest } from "@/lib/requests/auth/refreshJwt";

export default function OnboardingPage() {
    const [cookies] = useCookies(["auth_token", "auth_refresh_token"]);
    const [inOnboardingProc, setInOnboardingProc] = useState<boolean>(false);
    const [enableWidthAnimation, setEnableWidthAnimation] =
        useState<boolean>(true);
    const [currentScreen, setCurrentScreen] = useState<number>(0);
    const [isNextStepEnabled, setIsNextStepEnabled] = useState<boolean>(false);
    const [nextStepLoading, setNextStepLoading] = useState<boolean>(false);

    const { login } = useContext(AuthContext);
    const router = useRouter();

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

    const saveUserInfoMutation = useMutation({
        mutationFn: (userInfo: OnboardingUserInfo) =>
            setupUserRequest(
                {
                    username: userInfo.username,
                    nickname: userInfo.nickname,
                    birthDate: `${userInfo.birthYear}-01-01`,
                    gender: userInfo.gender as string,
                    occupation: userInfo.occupation as string,
                },
                cookies.auth_token,
            ),
        onError(error: Error | Record<string, string>) {
            if (error instanceof Error)
                return toast.error("發生未知的錯誤，請再試一次");

            if (error.detail == "Username already exists")
                return infoForm.setFieldError(
                    "username",
                    "此使用者名稱已被使用",
                );

            toast.error("發生未知的錯誤，請再試一次");
        },
    });

    const saveUserPreferenceMutation = useMutation({
        mutationFn: (userPreference: PostViewpointPreferenceParams) =>
            postViewpointPreference(userPreference).catch(() => null),
        onError() {
            toast.error("發生未知的錯誤，請再試一次");
        },
    });

    const completeOnboardingMutation = useMutation({
        mutationFn: async () => {
            await completeOnboardingRequest(cookies.auth_token);
            return await refreshJwtRequest(cookies.auth_refresh_token);
        },
        onSuccess(data) {
            login(data.accessToken, data.refreshToken, data.expirationTime);
            router.push("/");
        },
        onError() {
            toast.error("發生未知的錯誤，請再試一次");
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
                    if (
                        !infoForm.values.birthYear ||
                        !infoForm.values.gender ||
                        !infoForm.values.occupation
                    ) {
                        toast.error("請填寫所有必填欄位");
                        return;
                    }
                    await saveUserInfoMutation.mutateAsync({
                        username: infoForm.values.username,
                        nickname: infoForm.values.nickname,
                        birthYear: infoForm.values.birthYear,
                        gender: infoForm.values.gender,
                        occupation: infoForm.values.occupation,
                    });
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
                completeCallback: async () => {
                    if (
                        Object.values(interestsForm.values).some(
                            (value) => value === null,
                        )
                    ) {
                        toast.error("請填寫所有必填欄位");
                        return;
                    }
                    await saveUserPreferenceMutation.mutateAsync({
                        payload: Object.keys(interestsForm.values).map(
                            (key) => ({
                                id: key,
                                preference: interestsForm.values[key] as string,
                            }),
                        ),
                        auth_token: cookies.auth_token,
                    });
                },
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
                completeCallback: async () => {
                    await completeOnboardingMutation.mutateAsync();
                },
            },
        ],
        [
            infoForm,
            interestsForm,
            notificationForm,
            cookies.auth_token,
            saveUserInfoMutation,
            saveUserPreferenceMutation,
            completeOnboardingMutation,
        ],
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
        <main className="relative h-screen w-screen bg-neutral-50">
            <div
                className="absolute left-0 top-0 h-full items-center justify-end transition-[translate] duration-1000 md:hidden"
                style={{
                    translate: inOnboardingProc ? "-100%" : "0",
                }}
            >
                <img
                    src="/assets/CGGradient.jpeg"
                    className="h-full w-screen object-cover"
                    alt=""
                />
            </div>
            <div
                className={`absolute left-0 top-0 hidden h-full items-center justify-end md:flex ${
                    inOnboardingProc ? "md:w-[50vw]" : "md:w-screen"
                } ${enableWidthAnimation ? "transition-[width] duration-1000" : ""}`}
            >
                <img
                    src="/assets/CGGradient.jpeg"
                    className="h-full w-screen object-cover"
                    alt=""
                />
            </div>
            <div
                className={`absolute right-0 top-0 h-full w-full transition-[translate] duration-1000 md:w-[50vw] ${
                    inOnboardingProc ? "md:hidden md:translate-x-0" : ""
                }`}
                style={{
                    translate: inOnboardingProc ? "-100%" : "0",
                }}
            >
                <div className="absolute bottom-28 left-7 md:bottom-32 md:left-16">
                    <h1 className="text-3xl font-bold text-white md:text-6xl md:leading-[80px]">
                        <p className="block">歡迎加入</p>
                        <p className="block">尋求共識的夥伴們</p>
                    </h1>
                    <Button
                        className="mt-6 h-10 border-white text-white hover:text-neutral-50 md:h-16 md:w-32 md:rounded-lg md:text-xl"
                        variant="outline"
                        rightSection={
                            <img
                                src="/assets/logo-white.svg"
                                className="h-5 w-5 md:h-8 md:w-8"
                                alt=""
                            />
                        }
                        color="gray"
                        onClick={() => {
                            setInOnboardingProc(true);
                            setTimeout(() => {
                                setEnableWidthAnimation(false);
                            }, 1100);
                        }}
                    >
                        開始
                    </Button>
                </div>
            </div>
            <div
                className="absolute right-0 top-0 flex h-dvh w-screen justify-center overflow-hidden overflow-x-hidden pb-12 pt-20 transition-[translate] duration-1000 md:w-[50vw] md:items-center md:pt-0"
                style={{
                    translate: inOnboardingProc ? "0" : "100%",
                }}
            >
                <div className="mx-8 flex h-full w-full flex-shrink-0 flex-col justify-around px-8 md:mx-20 md:max-h-[67vh] md:w-[calc(50vw-160px)]">
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
