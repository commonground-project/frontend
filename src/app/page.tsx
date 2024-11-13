import { Suspense } from "react";
import DashboardPage from "@/app/dashboard/page";

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <DashboardPage />
            </Suspense>
        </div>
    );
}
