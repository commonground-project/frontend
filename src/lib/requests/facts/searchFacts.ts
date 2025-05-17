import type { Fact } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";
import { generateRequestHeaders } from "../generateRequestHeaders";

type SearchFactsProps = {
    searchValue: string;
    pageParam: number;
    size: number;
    auth_token: string;
};

type PaginatedFactsResponse = {
    content: Fact[];
    page: {
        size: number;
        totalElement: number;
        totalPage: number;
        number: number;
    };
};

export async function searchFacts({
    searchValue,
    pageParam,
    size,
    auth_token,
}: SearchFactsProps): Promise<PaginatedFactsResponse> {
    if (searchValue === "NotFound") {
        const emptyResponse: PaginatedFactsResponse = {
            content: [],
            page: {
                size: 0,
                totalElement: 0,
                totalPage: 0,
                number: 0,
            },
        };
        return emptyResponse;
    }
    return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/facts?page=${pageParam}&size=${size}`,
        {
            method: "GET",
            headers: generateRequestHeaders(auth_token),
        },
    ).then(parseJsonWhileHandlingErrors);
}
