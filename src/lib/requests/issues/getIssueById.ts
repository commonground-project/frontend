import type { Issue } from "@/types/conversations.types";
import { generateRequestHeaders } from "../generateRequestHeaders";

export const getIssueByID = async (
    id: string,
    token?: string,
): Promise<Issue> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${id}`,
        {
            method: "GET",
            headers: generateRequestHeaders(token),
        },
    ).then(async (res) => {
        if (res.status === 404) {
            throw new Error("Not found");
        } else if (!res.ok) {
            try {
                const parsedResponse = await res.json();
                throw new Error(parsedResponse.message);
            } catch {
                throw new Error(res.status.toString());
            }
        }
        return res.json();
    });
};
