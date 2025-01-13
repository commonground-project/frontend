import type { Fact } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";

export const createIsolatedFact = async (
    userToken: string,
    body: string,
): Promise<Fact> => {
    return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/facts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
        },
        body: body,
    }).then(parseJsonWhileHandlingErrors);
};
