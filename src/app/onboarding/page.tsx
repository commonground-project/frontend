"use client";

import { Button, TextInput } from "@mantine/core";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

import { useForm, zodResolver } from "@mantine/form";
import { useCookies } from "react-cookie";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import useAuth from "@/hooks/auth/useAuth";
import { setupUserRequest } from "@/lib/requests/auth/setupUser";
import { refreshJwtRequest } from "@/lib/requests/auth/refreshJwt";

export default function OnboardingPage() {
    const [cookies] = useCookies(["auth_token", "auth_refresh_token"]);
    const { login } = useAuth();
    const router = useRouter();

    const onboardingSchema = z.object({
        username: z
            .string()
            .regex(/^[a-zA-Z0-9._-]*$/, {
                message: "請使用英文字母、數字或半形句點、底線與減號",
            })
            .min(4, { message: "使用者名稱需長於 4 個字元" })
            .max(15, { message: "使用者名稱需短於 15 個字元" }),
        nickname: z
            .string()
            .min(1, { message: "暱稱需長於 1 個字元" })
            .max(20, { message: "暱稱需短於 20 個字元" }),
    });

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            username: "",
            nickname: "",
        },
        validate: zodResolver(onboardingSchema),
    });

    const setupUserMutation = useMutation({
        mutationKey: ["setupUser"],
        mutationFn: async (payload: typeof form.values) => {
            await setupUserRequest(payload, cookies.auth_token ?? "");
            return await refreshJwtRequest(cookies.auth_refresh_token ?? "");
        },
        onSuccess(data) {
            if (!data) return router.push("/login");
            login(data.accessToken, data.refreshToken, data.expirationTime);
            router.push("/");
        },
        onError(error) {
            console.log(error);
            console.log(error.message);
            if (error.message.startsWith("Error setting up user")) {
                toast.error("設定使用者時發生錯誤，請再試一次", {
                    description: "若錯誤持續發生，請聯繫 commonground 團隊",
                });
            } else {
                toast.error("重新登入時發生問題，請手動登入");
                router.push("/login");
            }
        },
    });

    return (
        <main className="flex flex-col items-center pt-[76px]">
            <div className="w-full max-w-3xl rounded-lg bg-neutral-100 px-6 py-5">
                <h1 className="mb-4 text-2xl font-semibold text-neutral-900">
                    歡迎來到 CommonGround
                </h1>
                <form
                    onSubmit={form.onSubmit((vals) =>
                        setupUserMutation.mutate(vals),
                    )}
                >
                    <TextInput
                        label="暱稱"
                        description="我們該如何稱呼您？"
                        required
                        {...form.getInputProps("nickname")}
                        key={form.key("nickname")}
                        size="md"
                        classNames={{
                            root: "w-full max-w-[430px] pb-[30px]",
                            input: "bg-transparent",
                        }}
                    />
                    <TextInput
                        label="使用者名稱"
                        description="您在平台上的 ID；請使用英文字母、數字或半形句點、底線與減號"
                        required
                        {...form.getInputProps("username")}
                        key={form.key("username")}
                        size="md"
                        classNames={{
                            root: "w-full max-w-[430px] pb-[30px]",
                            input: "bg-transparent",
                        }}
                    />
                    <Button
                        type="submit"
                        color="#2563eb"
                        rightSection={
                            <PaperAirplaneIcon className="size-4 stroke-white" />
                        }
                        size="sm"
                    >
                        開始使用
                    </Button>
                </form>
            </div>
        </main>
    );
}
