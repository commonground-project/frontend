import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "404 無法找到頁面",
    description: "我們找不到您請求的頁面",
};

export default function NotFound() {
    return (
        <div className="flex h-full items-center justify-center gap-24">
            <img src="/404.png" alt="404" className="inline-block w-[512px]" />
            <div className="inline-block">
                <h1 className="mb-9 font-sans text-9xl font-bold">404</h1>
                <h2 className="mb-6 font-sans text-4xl font-bold">
                    我們找不到您請求的頁面
                </h2>
                <h2 className="mb-6 font-sans text-2xl">
                    迷路了嗎？點擊
                    <Link
                        href="/"
                        className="mx-1.5 text-emerald-600 underline underline-offset-4"
                    >
                        這裡
                    </Link>
                    回到首頁
                </h2>
            </div>
        </div>
    );
}
