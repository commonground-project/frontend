import type { ViewPoint } from "@/types/conversations.types";

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
        .then(async (res) => {
            if (!res.ok) {
                let errorData: object | null = null;
                try {
                    errorData = await res.json();
                } catch {}
                throw {
                    status: res.status,
                    data: errorData,
                };
            }
            return res.json();
        })
        .then((res: ViewPoint) => {
            return { ...res, createdAt: new Date(res.createdAt) };
        });
};
