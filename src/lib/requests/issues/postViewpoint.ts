import { ViewPoint } from "@/types/conversations.types";

type postViewpointParams = {
    issueId: string;
    auth_token: string;
    title: string;
    content: string;
    facts: string[];
};

export const postViewpoint = async ({
    issueId,
    auth_token,
    title,
    content,
    facts,
}: postViewpointParams): Promise<ViewPoint> => {
    return await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issue/${issueId}/viewpoints`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
            },
            body: JSON.stringify({
                title: title,
                content: content,
                facts: facts,
            }),
        },
    )
        .then((res) => {
            if (!res.ok)
                throw new Error(`Error creating viewpoint: ${res.status}`);

            return res.json();
        })
        .then((res: ViewPoint) => {
            return { ...res, createdAt: new Date(res.createdAt) };
        });
};
