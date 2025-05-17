import { cookies } from "next/headers";
import { getViewpointByID } from "@/lib/requests/viewpoints/getViewpointById";

type ViewpointPageProps = {
    params: Promise<{ id: string; vpid: string }>;
};

export async function generateMetadata({ params }: ViewpointPageProps) {
    const pageParams = await params;
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth_token");

    const viewpoint = await getViewpointByID(
        pageParams.vpid,
        auth_token?.value ?? "",
    );
    return {
        title: `CommonGround - ${viewpoint.title}`,
        description: viewpoint.content,
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return children;
}
