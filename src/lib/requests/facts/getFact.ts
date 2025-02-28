import type { Fact } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";
import { generateRequestHeaders } from "../generateRequestHeaders";

type getFactParams = {
    factId: string;
    auth_token?: string;
};

export async function getFact({
    factId,
    auth_token,
}: getFactParams): Promise<Fact> {
    return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fact/${factId}`, {
        method: "GET",
        headers: generateRequestHeaders(auth_token),
    }).then(parseJsonWhileHandlingErrors);
}
