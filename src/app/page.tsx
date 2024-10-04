import { Button } from "@mantine/core";
import QueryWrapper from "./query/wrapper";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-8">CommonGround Project</h1>

        <div className="max-w-2xl text-center mb-8">
          <p className="text-lg mb-4">
            Welcome to the CommonGround Project. We aim to bring people together
            and find common ground on important issues.
          </p>
          <ol className="list-decimal list-inside text-left">
            <li className="mb-2">Explore diverse perspectives</li>
            <li className="mb-2">Engage in meaningful discussions</li>
            <li>Find solutions through collaboration</li>
          </ol>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mb-8">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
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
      <footer className="mt-auto p-4 text-center bg-black-100">
        <p>&copy; 2024 CommonGround Project. All rights reserved.</p>
      </footer>
    </div>
  );
}
