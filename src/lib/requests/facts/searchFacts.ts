import type { Fact } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";
import { generateRequestHeaders } from "../generateRequestHeaders";

type SearchFactsProps = {
    auth_token: string;
    searchValue: string;
};

export async function searchFacts({
    auth_token,
    searchValue,
}: SearchFactsProps): Promise<Fact[]> {
    if (searchValue === "NotFound") {
        return [];
    }
    return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/facts?page=${1}&size=${10}`,
        {
            method: "GET",
            headers: generateRequestHeaders(auth_token),
        },
    )
        .then(parseJsonWhileHandlingErrors)
        .then((data) => data.content);
}
