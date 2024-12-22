import AuthorViewpointCard from "@/components/AuthorViewpoint/AuthorViewpointCard";
import { Metadata } from "next";

type AuthorViewPointProps = {
    params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
    title: "CommonGround - 撰寫觀點",
    keywords: "社會時事, 觀點, 理性討論, 撰寫觀點",
};

export default async function AuthorViewPoint({
    params,
}: AuthorViewPointProps) {
    const id = (await params).id;

    return (
        <main className="mx-auto my-8 w-full max-w-7xl">
            <AuthorViewpointCard issueId={id} />
        </main>
    );
}
