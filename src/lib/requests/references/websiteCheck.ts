import { parseJsonWhileHandlingErrors } from "../transformers";

export async function websiteCheck({
    url,
    auth_token,
}: {
    url: string;
    auth_token: string;
}): Promise<{
    title: string;
    icon: string;
}> {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/website/check?url=${url}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    ).then(parseJsonWhileHandlingErrors);
}
