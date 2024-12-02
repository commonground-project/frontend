import { Suspense } from "react";

export default function Page() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Suspense fallback={<div>Loading...</div>}>
                <h1>CommonGround</h1>
            </Suspense>
        </div>
    );
}
