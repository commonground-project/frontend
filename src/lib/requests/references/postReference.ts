import { parseJsonWhileHandlingErrors } from "../transformers";
import { FactReference } from "@/types/conversations.types";

export async function postReference({
    url,
    auth_token,
}: {
    url: string;
    auth_token: string;
}): Promise<FactReference> {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/references`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({
                url: encodeURIComponent(url),
            }),
        },
    ).then(parseJsonWhileHandlingErrors);
}
