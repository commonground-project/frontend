import OnboardingCard from "@/components/Onboarding/OnboardingCard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "CommonGround - 開始使用",
};

export default function OnboardingPage() {
    return (
        <main className="flex flex-col items-center pt-[76px]">
            <OnboardingCard />
        </main>
    );
}
