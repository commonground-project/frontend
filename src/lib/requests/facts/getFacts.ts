import type { Fact } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";
import { generateRequestHeaders } from "../generateRequestHeaders";

type PaginatedFactsResponse = {
    content: Fact[];
    page: {
        size: number;
        totalElement: number;
        totalPage: number;
        number: number;
    };
};

export const getPaginatedFacts = async (
    pageParam: number,
    size: number = 10,
    auth_token?: string,
): Promise<PaginatedFactsResponse> => {
    return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/facts?page=${pageParam}&size=${size}`,
        {
            method: "GET",
            headers: generateRequestHeaders(auth_token),
        },
    ).then(parseJsonWhileHandlingErrors);
};
