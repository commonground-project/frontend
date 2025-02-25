import type { Fact } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";

export const createIsolatedFact = async (
    auth_token: string,
    body: string,
): Promise<Fact> => {
    return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/facts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`,
        },
        body: body,
    }).then(parseJsonWhileHandlingErrors);
};
