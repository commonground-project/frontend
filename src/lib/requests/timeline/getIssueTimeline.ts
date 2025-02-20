import { generateRequestHeaders } from "../generateRequestHeaders";
import { parseJsonWhileHandlingErrors } from "../transformers";
import { TimelineNode } from "@/types/conversations.types";

export type getIssueTimelineResponse = {
    content: TimelineNode[];
};

type getIssueTimelineParams = {
    issueId: string;
    auth_token?: string;
};

export async function getIssueTimeline({
    issueId,
    auth_token,
}: getIssueTimelineParams): Promise<getIssueTimelineResponse> {
    return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}/timeline`,
        {
            method: "GET",
            headers: generateRequestHeaders(auth_token),
        },
    )
        .then(parseJsonWhileHandlingErrors)
        .then((res: getIssueTimelineResponse) => {
            return {
                content: res.content.map((node) => ({
                    ...node,
                    createdAt: new Date(node.createdAt),
                    updatedAt: new Date(node.updatedAt),
                    date: new Date(node.date),
                })),
            };
        });
}
