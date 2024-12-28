import OnboardingCard from "@/components/Onboarding/OnboardingCard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CommonGround - 開始使用",
    description: "歡迎來到 CommonGround，請設定使用者名稱與暱稱。",
};

export default function OnboardingPage() {
    return (
        <main className="flex flex-col items-center pt-[76px]">
            <OnboardingCard />
        </main>
    );
}
