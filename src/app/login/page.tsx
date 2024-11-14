"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { FcGoogle } from "react-icons/fc";
import useSession from "@/hooks/useSession";

function LoginContent() {
    const { status, login } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const SessionToken = process.env.NEXT_PUBLIC_TEST_TOKEN;

    useEffect(() => {
        const token = searchParams?.get("token");
        if (token) {
            login(token);
            router.replace("/");
        }
    }, [searchParams, login, status, router]);

    useEffect(() => {
        if (status === "authenticated") {
            router.push("/");
        }
    }, [status, router]);

    const handleLogin = () => {
        if (SessionToken) {
            login(SessionToken);
        } else {
            console.error("SessionToken is undefined");
        }
    };

    if (status === "loading") {
        return (
            <div className="flex items-center text-center">
                <p>Loading...</p>
                <span className="animate-spin">⌛</span>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="center rounded-lg bg-gray-100 px-20 py-10 font-bold text-black shadow-md">
                <h1 className="mb-4 text-center text-2xl">登入 CommonGround</h1>
                <div className="flex justify-center">
                    <button
                        onClick={handleLogin}
                        className="flex items-center space-x-2 rounded-lg bg-white px-4 py-2 text-black transition-colors hover:bg-gray-200"
                    >
                        <FcGoogle size={25} />
                        <span>Continue with Google</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center text-center">
                    <p>Loading...</p>
                    <span className="animate-spin">⌛</span>
                </div>
            }
        >
            <LoginContent />
        </Suspense>
    );
}
