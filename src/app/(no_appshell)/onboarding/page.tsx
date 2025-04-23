"use client";

import { Button, Progress } from "@mantine/core";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";

import useAuth from "@/hooks/auth/useAuth";
import { useMemo, useState } from "react";

export default function OnboardingPage() {
    const [cookies] = useCookies(["auth_token", "auth_refresh_token"]);
    const { login, logout } = useAuth();
    const router = useRouter();
    const [currentScreen, setCurrentScreen] = useState<number>(0);

    const onboardingScreens = useMemo(
        () => [
            {
                title: "歡迎來到 CommonGround",
            },
            {
                title: "設定您的暱稱",
            },
        ],
        [],
    );

    return (
        <main className="relative flex h-screen w-screen items-center justify-center">
            <div className="flex h-full w-[50vw] items-center justify-end">
                <img src="/assets/CGGradient.jpeg" className="h-full" alt="" />
            </div>
            <div className="flex h-full w-[50vw] items-center justify-center overflow-hidden">
                <div className="mx-20 flex h-full max-h-[67vh] w-full flex-col justify-around">
                    <div className="h-full w-full">
                        {onboardingScreens.map((ele, i) => (
                            <motion.div
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
                                <h1>{ele.title}</h1>
                            </motion.div>
                        ))}
                    </div>
                    <div className="w-full">
                        <Progress
                            value={Math.max(5, (currentScreen / 5) * 100)}
                        />
                        <div className="ml-auto mt-6 flex w-full max-w-sm items-center justify-end">
                            {currentScreen >= 1 && (
                                <Button
                                    className="w-1/3 rounded-lg"
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
                                className="w-2/3 rounded-lg pl-5"
                                size="md"
                                rightSection={
                                    <ArrowRightIcon className="w-6" />
                                }
                                variant="filled"
                                color="emerald"
                                onClick={() =>
                                    setCurrentScreen(currentScreen + 1)
                                }
                            >
                                下一步
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
