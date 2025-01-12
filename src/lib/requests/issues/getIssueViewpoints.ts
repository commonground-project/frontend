import type { ViewPoint } from "@/types/conversations.types";

type getIssueViewpointsParams = {
    issueId: string;
    pageParam: number;
    auth_token: string;
};

export type getIssueViewpointsResponse = {
    content: ViewPoint[];
    page: {
        size: number;
        totalElement: number;
        totalPage: number;
        number: number;
    };
};

export const getIssueViewpoints = async ({
    issueId,
    pageParam,
    auth_token,
}: getIssueViewpointsParams): Promise<getIssueViewpointsResponse> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}/viewpoints?size=10&page=${pageParam}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
        },
    )
        .then((res) => {
            if (!res.ok)
                throw new Error(
                    `Error fetching issue viewpoints: ${res.status}`,
                );
            else return res.json();
        })
        .then((res: getIssueViewpointsResponse) => {
            return {
                ...res,
                content: res.content.map((viewpoint) => ({
                    ...viewpoint,
                    createdAt: new Date(viewpoint.createdAt),
                })),
            };
        });
};
