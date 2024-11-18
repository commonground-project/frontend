import Link from "next/link";

export default function Header() {
    return (
        <div className="fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-center bg-neutral-100">
            <Link href="/">
                <h1 className="text-2xl font-bold text-black">CommonGround</h1>
            </Link>
        </div>
    );
}
