import { Button } from "@mantine/core";
import QueryWrapper from "./query/wrapper";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex flex-grow flex-col items-center justify-center p-8">
                <h1 className="mb-8 text-4xl font-bold">
                    CommonGround Project
                </h1>

                <div className="mb-8 max-w-2xl text-center">
                    <p className="mb-4 text-lg">
                        Welcome to the CommonGround Project. We aim to bring
                        people together and find common ground on important
                        issues.
                    </p>
                    <ol className="list-inside list-decimal text-left">
                        <li className="mb-2">Explore diverse perspectives</li>
                        <li className="mb-2">
                            Engage in meaningful discussions
                        </li>
                        <li>Find solutions through collaboration</li>
                    </ol>
                </div>

                <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">
                    <Button
                        className="bg-blue-500 text-white hover:bg-blue-600"
                        component="a"
                        href="/explore"
                    >
                        Start Exploring
                    </Button>
                    <Button
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                        component="a"
                        href="/about"
                    >
                        About Us
                    </Button>
                </div>
                <QueryWrapper />
            </main>
            <footer className="bg-black-100 mt-auto p-4 text-center">
                <p>&copy; 2024 CommonGround Project. All rights reserved.</p>
            </footer>
        </div>
    );
}
