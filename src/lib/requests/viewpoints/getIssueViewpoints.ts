import type { ViewPoint } from "@/types/conversations.types";
import { parseJsonWhileHandlingErrors } from "../transformers";
import type { PaginatedPage } from "@/types/requests.types";
import { generateRequestHeaders } from "../generateRequestHeaders";

type getIssueViewpointsParams = {
    issueId: string;
    pageParam: number;
    auth_token?: string;
};

export const getIssueViewpoints = async ({
    issueId,
    pageParam,
    auth_token,
}: getIssueViewpointsParams): Promise<PaginatedPage<ViewPoint>> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}/viewpoints?size=10&page=${pageParam}`,
        {
            method: "GET",
            headers: generateRequestHeaders(auth_token),
        },
    )
        .then(parseJsonWhileHandlingErrors)
        .then((res: PaginatedPage<ViewPoint>) => {
            return {
                ...res,
                content: res.content.map((viewpoint) => ({
                    ...viewpoint,
                    createdAt: new Date(viewpoint.createdAt),
                    updatedAt: new Date(viewpoint.updatedAt),
                })),
            };
        });
};
